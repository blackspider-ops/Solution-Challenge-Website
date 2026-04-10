"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type RoomBookingResult =
  | { status: "success"; roomName: string; bookedAt: Date }
  | { status: "room_full"; roomName: string; capacity: number; currentBookings: Array<{ teamName: string; leaderName: string | null; leaderEmail: string }> }
  | { status: "already_booked"; roomName: string }
  | { status: "no_team"; message: string }
  | { status: "invalid" }
  | { status: "unauthorized" };

/**
 * Book a room for a team by scanning QR code
 */
export async function bookRoomForTeam(qrToken: string): Promise<RoomBookingResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "unauthorized" };
  }

  // Input validation
  if (!qrToken?.trim()) {
    return { status: "invalid" };
  }

  // Use transaction to prevent race conditions
  try {
    const result = await db.$transaction(async (tx) => {
      // Find the room with lock
      const room = await tx.room.findUnique({
        where: { qrToken: qrToken.trim(), active: true },
        include: {
          bookings: {
            include: {
              team: {
                include: {
                  leader: {
                    select: { name: true, email: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!room) {
        return { status: "invalid" as const };
      }

      // Find user's team (either as leader or member)
      const userTeam = await tx.team.findFirst({
        where: {
          OR: [
            { leaderId: session.user.id },
            { members: { some: { userId: session.user.id } } },
          ],
        },
        include: {
          roomBookings: true,
        },
      });

      if (!userTeam) {
        return {
          status: "no_team" as const,
          message: "You must be part of a team to book a hacking space",
        };
      }

      // Check if team already has ANY room booking
      if (userTeam.roomBookings.length > 0) {
        const existingRoom = await tx.room.findFirst({
          where: { id: userTeam.roomBookings[0].roomId },
          select: { name: true },
        });
        return {
          status: "already_booked" as const,
          roomName: existingRoom?.name ?? "a room",
        };
      }

      // Check if room is at capacity
      if (room.bookings.length >= room.capacity) {
        return {
          status: "room_full" as const,
          roomName: room.name,
          capacity: room.capacity,
          currentBookings: room.bookings.map((b) => ({
            teamName: b.team.name,
            leaderName: b.team.leader.name,
            leaderEmail: b.team.leader.email,
          })),
        };
      }

      // Create booking
      const booking = await tx.roomBooking.create({
        data: {
          roomId: room.id,
          teamId: userTeam.id,
        },
      });

      return {
        status: "success" as const,
        roomName: room.name,
        bookedAt: booking.bookedAt,
      };
    });

    if (result.status === "success") {
      revalidatePath("/dashboard/team");
      revalidatePath("/dashboard/submission");
      revalidatePath("/admin/rooms");
    }

    return result;
  } catch (error) {
    console.error("Room booking error:", error);
    return { status: "invalid" };
  }
}

/**
 * Get all rooms with booking information
 */
export async function getRooms() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return { error: "Unauthorized - Admin access required" };
  }

  try {
    const rooms = await db.room.findMany({
      orderBy: { order: "asc" },
      include: {
        bookings: {
          include: {
            team: {
              include: {
                leader: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    return { data: rooms };
  } catch (error) {
    console.error("Get rooms error:", error);
    return { error: "Failed to fetch rooms" };
  }
}

/**
 * Create a new room (admin only)
 */
export async function createRoom(data: {
  name: string;
  description?: string;
  capacity: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // Input validation
    if (!data.name?.trim()) {
      return { error: "Room name is required" };
    }

    if (typeof data.capacity !== "number" || data.capacity < 1 || data.capacity > 50) {
      return { error: "Capacity must be between 1 and 50" };
    }

    // Sanitize inputs
    const sanitizedName = data.name.trim().slice(0, 100);
    const sanitizedDescription = data.description?.trim().slice(0, 500);

    const maxOrder = await db.room.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const room = await db.room.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        capacity: Math.floor(data.capacity),
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/rooms");
    return { data: room };
  } catch (error) {
    console.error("Create room error:", error);
    return { error: "Failed to create room" };
  }
}

/**
 * Update a room (admin only)
 */
export async function updateRoom(
  id: string,
  data: {
    name?: string;
    description?: string;
    capacity?: number;
    active?: boolean;
  }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // Input validation
    if (!id) {
      return { error: "Room ID is required" };
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) {
        return { error: "Room name cannot be empty" };
      }
      updateData.name = trimmed.slice(0, 100);
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim().slice(0, 500) || null;
    }

    if (data.capacity !== undefined) {
      if (typeof data.capacity !== "number" || data.capacity < 1 || data.capacity > 50) {
        return { error: "Capacity must be between 1 and 50" };
      }
      updateData.capacity = Math.floor(data.capacity);
    }

    if (data.active !== undefined) {
      updateData.active = Boolean(data.active);
    }

    const room = await db.room.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/dashboard/team");
    return { data: room };
  } catch (error) {
    console.error("Update room error:", error);
    return { error: "Failed to update room" };
  }
}

/**
 * Delete a room (admin only)
 */
export async function deleteRoom(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // Input validation
    if (!id) {
      return { error: "Room ID is required" };
    }

    // Check if room has bookings
    const bookingsCount = await db.roomBooking.count({
      where: { roomId: id },
    });

    if (bookingsCount > 0) {
      return { error: `Cannot delete room with ${bookingsCount} active bookings. Deactivate it instead.` };
    }

    await db.room.delete({
      where: { id },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/submission");
    return { success: true };
  } catch (error) {
    console.error("Delete room error:", error);
    return { error: "Failed to delete room" };
  }
}

/**
 * Check if a team has booked a hacking space
 */
export async function hasTeamBookedRoom(teamId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  // Input validation
  if (!teamId) {
    return false;
  }

  const booking = await db.roomBooking.findFirst({
    where: { teamId },
  });
  return !!booking;
}

/**
 * Get team's room booking
 */
export async function getTeamRoomBooking(teamId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Input validation
  if (!teamId) {
    return { error: "Team ID is required" };
  }

  // Verify user is part of the team or is admin
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return { error: "You are not a member of this team" };
    }
  }

  try {
    const booking = await db.roomBooking.findFirst({
      where: { teamId },
      include: {
        room: true,
      },
    });

    return { data: booking };
  } catch (error) {
    console.error("Get team room booking error:", error);
    return { error: "Failed to fetch room booking" };
  }
}

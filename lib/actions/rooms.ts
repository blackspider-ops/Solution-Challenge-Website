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

  // Find the room
  const room = await db.room.findUnique({
    where: { qrToken, active: true },
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
    return { status: "invalid" };
  }

  // Find user's team (either as leader or member)
  const userTeam = await db.team.findFirst({
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
      status: "no_team",
      message: "You must be part of a team to book a hacking space",
    };
  }

  // Check if team already booked this room
  const existingBooking = room.bookings.find((b) => b.teamId === userTeam.id);
  if (existingBooking) {
    return {
      status: "already_booked",
      roomName: room.name,
    };
  }

  // Check if room is at capacity
  if (room.bookings.length >= room.capacity) {
    return {
      status: "room_full",
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
  const booking = await db.roomBooking.create({
    data: {
      roomId: room.id,
      teamId: userTeam.id,
    },
  });

  revalidatePath("/dashboard/team");
  revalidatePath("/admin/rooms");

  return {
    status: "success",
    roomName: room.name,
    bookedAt: booking.bookedAt,
  };
}

/**
 * Get all rooms with booking information
 */
export async function getRooms() {
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
    const maxOrder = await db.room.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const room = await db.room.create({
      data: {
        ...data,
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
    const room = await db.room.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/rooms");
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
    await db.room.delete({
      where: { id },
    });

    revalidatePath("/admin/rooms");
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
  const booking = await db.roomBooking.findFirst({
    where: { teamId },
  });
  return !!booking;
}

/**
 * Get team's room booking
 */
export async function getTeamRoomBooking(teamId: string) {
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

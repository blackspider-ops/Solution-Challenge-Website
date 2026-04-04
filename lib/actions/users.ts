"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

/**
 * Get all users with their registration status
 */
export async function getAllUsers() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        image: true,
        registration: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: users };
  } catch (error) {
    console.error("Get users error:", error);
    return { error: "Failed to fetch users" };
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: Role) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // Get the target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!targetUser) {
      return { error: "User not found" };
    }

    // Check if current user is super admin (Tejas Singhal with @psu.edu email)
    const isSuperAdmin = 
      session.user.name === "Tejas Singhal" && 
      session.user.email?.endsWith("@psu.edu");

    // Prevent admin from demoting themselves
    if (userId === session.user.id && newRole !== "admin") {
      return { error: "You cannot change your own admin role" };
    }

    // Prevent non-super-admins from demoting other admins
    if (targetUser.role === "admin" && newRole !== "admin" && !isSuperAdmin) {
      return { error: "Only the super admin can change admin roles" };
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    revalidatePath("/admin/users");
    return { data: user };
  } catch (error) {
    console.error("Update user role error:", error);
    return { error: "Failed to update user role" };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const [totalUsers, registeredUsers, adminUsers, volunteerUsers] = await Promise.all([
      db.user.count(),
      db.user.count({
        where: {
          registration: {
            isNot: null,
          },
        },
      }),
      db.user.count({
        where: { role: "admin" },
      }),
      db.user.count({
        where: { role: "volunteer" },
      }),
    ]);

    return {
      data: {
        totalUsers,
        registeredUsers,
        unregisteredUsers: totalUsers - registeredUsers,
        adminUsers,
        volunteerUsers,
        participantUsers: totalUsers - adminUsers - volunteerUsers,
      },
    };
  } catch (error) {
    console.error("Get user stats error:", error);
    return { error: "Failed to fetch user statistics" };
  }
}

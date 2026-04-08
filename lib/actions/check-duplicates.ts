"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function checkDuplicateUsers() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    // Find duplicate emails using raw query
    const duplicates = await db.$queryRaw<Array<{ email: string; count: bigint }>>`
      SELECT email, COUNT(*) as count
      FROM "User"
      GROUP BY email
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `;

    const duplicateDetails = [];

    for (const dup of duplicates) {
      const users = await db.user.findMany({
        where: { email: dup.email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          registration: {
            select: {
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      duplicateDetails.push({
        email: dup.email,
        count: Number(dup.count),
        users,
      });
    }

    const totalUsers = await db.user.count();
    const uniqueEmails = await db.user.groupBy({
      by: ["email"],
    });

    return {
      data: {
        duplicates: duplicateDetails,
        summary: {
          totalUsers,
          uniqueEmails: uniqueEmails.length,
          duplicateAccounts: totalUsers - uniqueEmails.length,
        },
      },
    };
  } catch (error) {
    console.error("Check duplicates error:", error);
    return { error: "Failed to check duplicates" };
  }
}

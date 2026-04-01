"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type CheckInResult =
  | { status: "success";      name: string | null; email: string; checkedInAt: Date }
  | { status: "already_in";   name: string | null; email: string; checkedInAt: Date }
  | { status: "invalid" }
  | { status: "unauthorized" }
  | { status: "unauthenticated" };

/**
 * Check in a participant by their QR token.
 * Returns a typed status so the UI can show distinct states.
 * The DB-level @@unique([ticketId]) on CheckIn prevents any race-condition duplicates.
 */
export async function checkInParticipant(qrToken: string): Promise<CheckInResult> {
  const session = await auth();
  if (!session?.user?.id) return { status: "unauthenticated" };

  const role = session.user.role;
  if (role !== "admin" && role !== "volunteer") return { status: "unauthorized" };

  const ticket = await db.ticket.findUnique({
    where: { qrToken: qrToken.trim() },
    include: {
      checkIn: true,
      registration: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  if (!ticket) return { status: "invalid" };

  const { name, email } = ticket.registration.user;

  // Already checked in — return info so UI can show who and when
  if (ticket.checkIn) {
    return {
      status: "already_in",
      name,
      email,
      checkedInAt: ticket.checkIn.checkedInAt,
    };
  }

  const checkIn = await db.checkIn.create({
    data: {
      ticketId: ticket.id,
      performedBy: session.user.id,
    },
  });

  return { status: "success", name, email, checkedInAt: checkIn.checkedInAt };
}

/**
 * Recent check-ins for the admin dashboard (last 50).
 * Requires admin or volunteer role.
 */
export async function getRecentCheckIns() {
  const session = await auth();
  if (!session?.user?.id) return [];
  if (session.user.role !== "admin" && session.user.role !== "volunteer") return [];

  return db.checkIn.findMany({
    orderBy: { checkedInAt: "desc" },
    take: 50,
    include: {
      ticket: {
        include: {
          registration: {
            include: { user: { select: { name: true, email: true, image: true } } },
          },
        },
      },
      performer: { select: { name: true, email: true } },
    },
  });
}

/**
 * Aggregate check-in stats.
 * Requires admin or volunteer role.
 */
export async function getCheckInStats() {
  const session = await auth();
  if (!session?.user?.id) return { total: 0, checkedIn: 0, remaining: 0 };
  if (session.user.role !== "admin" && session.user.role !== "volunteer") {
    return { total: 0, checkedIn: 0, remaining: 0 };
  }

  const [total, checkedIn] = await Promise.all([
    db.ticket.count(),
    db.checkIn.count(),
  ]);
  return { total, checkedIn, remaining: total - checkedIn };
}

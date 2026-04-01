"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Register the current user for the event.
 * Creates a Registration (confirmed) and issues a Ticket in one transaction.
 */
export async function registerForEvent(): Promise<
  { error: string } | { data: { id: string; ticketId: string } }
> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await db.registration.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) return { error: "You are already registered" };

  try {
    // Use a transaction: create Registration + Ticket atomically
    const result = await db.$transaction(async (tx) => {
      const registration = await tx.registration.create({
        data: { userId: session.user.id, status: "confirmed" },
      });
      const ticket = await tx.ticket.create({
        data: { registrationId: registration.id },
      });
      return { registration, ticket };
    });

    return { data: { id: result.registration.id, ticketId: result.ticket.id } };
  } catch {
    return { error: "Failed to register. Please try again." };
  }
}

/**
 * Get the current user's registration with their ticket.
 */
export async function getMyRegistration() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.registration.findUnique({
    where: { userId: session.user.id },
    include: { ticket: { include: { checkIn: true } } },
  });
}

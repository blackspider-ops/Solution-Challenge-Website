"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const eventSettingsSchema = z.object({
  maxCapacity: z.number().int().min(1).max(10000),
  registrationOpen: z.boolean(),
  emailsEnabled: z.boolean().optional(),
});

// ─── Get Settings ──────────────────────────────────────────────────────────

export async function getEventSettings() {
  try {
    let settings = await db.eventSettings.findUnique({
      where: { id: "singleton" },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await db.eventSettings.create({
        data: {
          id: "singleton",
          maxCapacity: 100,
          registrationOpen: true,
          emailsEnabled: true,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Get event settings error:", error);
    return { id: "singleton", maxCapacity: 100, registrationOpen: true, emailsEnabled: true, updatedAt: new Date(), updatedBy: null };
  }
}

// ─── Update Settings ───────────────────────────────────────────────────────

export async function updateEventSettings(
  input: unknown
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = eventSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // Check if trying to update emailsEnabled - only super admin can do this
  if (parsed.data.emailsEnabled !== undefined) {
    const isSuperAdmin = 
      session.user.name === "Tejas Singhal" && 
      session.user.email?.endsWith("@psu.edu");
    
    if (!isSuperAdmin) {
      return { error: "Only the super admin can toggle email settings" };
    }
  }

  try {
    await db.eventSettings.upsert({
      where: { id: "singleton" },
      update: {
        ...parsed.data,
        updatedBy: session.user.id,
      },
      create: {
        id: "singleton",
        ...parsed.data,
        updatedBy: session.user.id,
      },
    });

    return { data: true };
  } catch (error) {
    console.error("Update event settings error:", error);
    return { error: "Failed to update settings" };
  }
}

// ─── Get Waitlist Stats ────────────────────────────────────────────────────

export async function getWaitlistStats() {
  try {
    const [confirmed, waitlisted] = await Promise.all([
      db.registration.count({ where: { status: "confirmed" } }),
      db.registration.count({ where: { status: "waitlisted" } }),
    ]);

    return { confirmed, waitlisted };
  } catch (error) {
    console.error("Get waitlist stats error:", error);
    return { confirmed: 0, waitlisted: 0 };
  }
}

// ─── Promote from Waitlist ────────────────────────────────────────────────

export async function promoteFromWaitlist(
  registrationId: string
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  try {
    const registration = await db.registration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    });

    if (!registration) return { error: "Registration not found" };
    if (registration.status !== "waitlisted") return { error: "User is not on waitlist" };

    // Get settings
    const settings = await getEventSettings();

    // Promote to confirmed and create ticket (with capacity check in transaction)
    await db.$transaction(async (tx) => {
      // Check capacity inside transaction to prevent race conditions
      const confirmedCount = await tx.registration.count({ where: { status: "confirmed" } });

      if (confirmedCount >= settings.maxCapacity) {
        throw new Error("Event is at full capacity");
      }

      await tx.registration.update({
        where: { id: registrationId },
        data: {
          status: "confirmed",
          waitlistPosition: null,
        },
      });

      // Create ticket
      await tx.ticket.create({
        data: {
          registrationId: registrationId,
        },
      });
    });

    // Send ticket email
    const { sendTicketEmail } = await import("@/lib/email");
    const ticket = await db.ticket.findUnique({
      where: { registrationId },
    });

    if (ticket) {
      await sendTicketEmail(
        registration.user.email,
        registration.user.name || registration.user.email,
        ticket.qrToken
      );
    }

    return { data: true };
  } catch (error) {
    console.error("Promote from waitlist error:", error);
    
    // Check if it's our capacity error
    if (error instanceof Error && error.message === "Event is at full capacity") {
      return { error: "Event is at full capacity" };
    }
    
    return { error: "Failed to promote user" };
  }
}

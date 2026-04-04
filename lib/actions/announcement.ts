"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { announcementSchema } from "@/lib/schemas/announcement";
import { sendAnnouncementEmail } from "@/lib/email";

// ─── Create ────────────────────────────────────────────────────────────────

export async function createAnnouncement(
  input: unknown
): Promise<{ error: string } | { data: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const announcement = await db.announcement.create({
      data: { ...parsed.data, createdById: session.user.id },
    });
    return { data: { id: announcement.id } };
  } catch {
    return { error: "Failed to create announcement." };
  }
}

// ─── Send announcement email ───────────────────────────────────────────────

export async function sendAnnouncementAsEmail(
  id: string
): Promise<{ error: string } | { data: { sent: number } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  try {
    // Get announcement
    const announcement = await db.announcement.findUnique({
      where: { id },
    });

    if (!announcement) return { error: "Announcement not found" };

    let emails: string[] = [];

    // Get emails based on audience
    if (announcement.audience === "all") {
      // Get ALL registered users (participants, volunteers, admins)
      const registrations = await db.registration.findMany({
        where: { status: "confirmed" },
        include: { user: { select: { email: true } } },
      });
      emails = registrations.map((r) => r.user.email);
    } else if (announcement.audience === "registered") {
      // Get only registered participants (not volunteers/admins)
      const registrations = await db.registration.findMany({
        where: { 
          status: "confirmed",
          user: { role: "participant" }
        },
        include: { user: { select: { email: true } } },
      });
      emails = registrations.map((r) => r.user.email);
    } else if (announcement.audience === "volunteers") {
      // Get users who have submitted volunteer registration
      const volunteerRegs = await db.volunteerRegistration.findMany({
        include: { user: { select: { email: true } } },
      });
      emails = volunteerRegs.map((v) => v.user.email);
    }

    if (emails.length === 0) {
      return { error: `No ${announcement.audience === "all" ? "registered participants" : announcement.audience} to email` };
    }

    // Send email
    const result = await sendAnnouncementEmail(
      emails,
      announcement.title,
      announcement.body
    );

    if (!result.success) {
      return { error: result.error || "Failed to send emails" };
    }

    return { data: { sent: emails.length } };
  } catch (error) {
    console.error("Send announcement email error:", error);
    return { error: "Failed to send announcement email" };
  }
}

// ─── Update ────────────────────────────────────────────────────────────────

export async function updateAnnouncement(
  id: string,
  input: unknown
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const existing = await db.announcement.findUnique({ where: { id } });
  if (!existing) return { error: "Announcement not found" };

  await db.announcement.update({ where: { id }, data: parsed.data });
  return { data: true };
}

// ─── Toggle published ──────────────────────────────────────────────────────

export async function toggleAnnouncementPublished(
  id: string
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const existing = await db.announcement.findUnique({ where: { id } });
  if (!existing) return { error: "Announcement not found" };

  await db.announcement.update({
    where: { id },
    data: { published: !existing.published },
  });
  return { data: true };
}

// ─── Toggle pinned ─────────────────────────────────────────────────────────

export async function toggleAnnouncementPinned(
  id: string
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const existing = await db.announcement.findUnique({ where: { id } });
  if (!existing) return { error: "Announcement not found" };

  await db.announcement.update({
    where: { id },
    data: { pinned: !existing.pinned },
  });
  return { data: true };
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteAnnouncement(
  id: string
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const existing = await db.announcement.findUnique({ where: { id } });
  if (!existing) return { error: "Announcement not found" };

  await db.announcement.delete({ where: { id } });
  return { data: true };
}

// ─── Read (no auth required) ───────────────────────────────────────────────

export async function getPublishedAnnouncements(limit = 20) {
  return db.announcement.findMany({
    where: { published: true },
    orderBy: [
      { pinned: "desc" },    // pinned first
      { createdAt: "desc" }, // then newest
    ],
    take: limit,
    select: {
      id: true,
      title: true,
      body: true,
      pinned: true,
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { name: true } },
    },
  });
}

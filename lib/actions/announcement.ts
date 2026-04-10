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

// ─── Auto-send announcement to new registrations ──────────────────────────

export async function sendWelcomeAnnouncementToNewUsers(): Promise<{ sent: number }> {
  try {
    // Get the most recent pinned announcement (welcome message)
    const welcomeAnnouncement = await db.announcement.findFirst({
      where: { 
        published: true,
        pinned: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!welcomeAnnouncement) {
      console.log("No pinned announcement found for auto-send");
      return { sent: 0 };
    }

    // Get users who registered in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const newRegistrations = await db.registration.findMany({
      where: {
        status: "confirmed",
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      include: { user: { select: { email: true } } },
    });

    if (newRegistrations.length === 0) {
      return { sent: 0 };
    }

    const emails = newRegistrations.map((r) => r.user.email);

    // Filter out users who have already received this announcement
    const alreadySent = await db.announcementSent.findMany({
      where: {
        announcementId: welcomeAnnouncement.id,
        userEmail: { in: emails },
      },
      select: { userEmail: true },
    });

    const alreadySentEmails = new Set(alreadySent.map((s) => s.userEmail));
    const emailsToSend = emails.filter((email) => !alreadySentEmails.has(email));

    if (emailsToSend.length === 0) {
      console.log("All new users have already received the welcome announcement");
      return { sent: 0 };
    }

    // Send the welcome announcement
    const result = await sendAnnouncementEmail(
      emailsToSend,
      welcomeAnnouncement.title,
      welcomeAnnouncement.body
    );

    if (result.success) {
      // Track sent emails
      await db.announcementSent.createMany({
        data: emailsToSend.map((email) => ({
          announcementId: welcomeAnnouncement.id,
          userEmail: email,
        })),
        skipDuplicates: true,
      });

      console.log(`Auto-sent welcome announcement to ${emailsToSend.length} new users`);
      return { sent: emailsToSend.length };
    }

    return { sent: 0 };
  } catch (error) {
    console.error("Auto-send announcement error:", error);
    return { sent: 0 };
  }
}

// ─── Send announcement email ───────────────────────────────────────────────

export async function sendAnnouncementAsEmail(
  id: string,
  forceResend: boolean = false
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
      // Get ALL users in the database
      const users = await db.user.findMany({
        select: { email: true },
      });
      emails = users.map((u) => u.email);
    } else if (announcement.audience === "registered") {
      // Get only participants with confirmed registration
      const registrations = await db.registration.findMany({
        where: { 
          status: "confirmed",
        },
        include: { user: { select: { email: true } } },
      });
      emails = registrations.map((r) => r.user.email);
    } else if (announcement.audience === "not_registered") {
      // Get users who have accounts but no registration (exclude volunteers and admins)
      const usersWithoutRegistration = await db.user.findMany({
        where: {
          role: "participant",
          registration: null,
          volunteerRegistration: null, // Exclude those who registered as volunteers
        },
        select: { email: true },
      });
      emails = usersWithoutRegistration.map((u) => u.email);
    } else if (announcement.audience === "volunteers") {
      // Get only users with volunteer role
      const volunteers = await db.user.findMany({
        where: { role: "volunteer" },
        select: { email: true },
      });
      emails = volunteers.map((v) => v.email);
    } else if (announcement.audience === "admins") {
      // Get only users with admin role
      const admins = await db.user.findMany({
        where: { role: "admin" },
        select: { email: true },
      });
      emails = admins.map((a) => a.email);
    } else if (announcement.audience === "waitlisted") {
      // Get only users on the waitlist
      const waitlisted = await db.registration.findMany({
        where: { status: "waitlisted" },
        include: { user: { select: { email: true } } },
      });
      emails = waitlisted.map((w) => w.user.email);
    }

    if (emails.length === 0) {
      return { error: `No ${announcement.audience === "all" ? "users" : announcement.audience} to email` };
    }

    // Filter out users who have already received this announcement (unless forceResend is true)
    let emailsToSend = emails;
    
    if (!forceResend) {
      const alreadySent = await db.announcementSent.findMany({
        where: {
          announcementId: id,
          userEmail: { in: emails },
        },
        select: { userEmail: true },
      });

      const alreadySentEmails = new Set(alreadySent.map((s) => s.userEmail));
      emailsToSend = emails.filter((email) => !alreadySentEmails.has(email));

      if (emailsToSend.length === 0) {
        return { error: "All users have already received this announcement" };
      }
    }

    // Send email
    const result = await sendAnnouncementEmail(
      emailsToSend,
      announcement.title,
      announcement.body
    );

    if (!result.success) {
      return { error: result.error || "Failed to send emails" };
    }

    // Track sent emails (only if not force resending, to avoid duplicate tracking)
    if (!forceResend) {
      await db.announcementSent.createMany({
        data: emailsToSend.map((email) => ({
          announcementId: id,
          userEmail: email,
        })),
        skipDuplicates: true,
      });
    }

    return { data: { sent: emailsToSend.length } };
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
  const session = await auth();
  
  // Build audience filter based on user's role and registration status
  const audienceFilter: string[] = ["all"]; // Everyone sees "all" announcements
  
  if (session?.user) {
    // Check user's role
    if (session.user.role === "admin") {
      audienceFilter.push("admins");
    } else if (session.user.role === "volunteer") {
      audienceFilter.push("volunteers");
    }
    
    // Check registration status
    const registration = await db.registration.findUnique({
      where: { userId: session.user.id },
      select: { status: true },
    });
    
    if (registration) {
      if (registration.status === "confirmed") {
        audienceFilter.push("registered");
      } else if (registration.status === "waitlisted") {
        audienceFilter.push("waitlisted");
      }
    }
  }
  
  return db.announcement.findMany({
    where: { 
      published: true,
      audience: { in: audienceFilter },
    },
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

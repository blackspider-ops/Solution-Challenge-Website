"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissionSchema } from "@/lib/schemas/submission";

// ─── Save draft ────────────────────────────────────────────────────────────

export async function upsertSubmission(
  input: unknown
): Promise<{ error: string } | { data: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // Use findUnique — @@unique([userId]) guarantees at most one row
  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: { team: { include: { submission: true } } },
  });

  if (!membership) return { error: "You must be on a team to submit" };
  if (!membership.team.trackId) {
    return { error: "Your team leader must select a challenge track before you can submit" };
  }

  // Block edits on already-submitted projects
  if (membership.team.submission?.status === "submitted") {
    return { error: "Your project has already been submitted and cannot be edited" };
  }
  if (membership.team.submission?.status === "reviewed") {
    return { error: "Your project has been reviewed and cannot be edited" };
  }

  try {
    const submission = await db.submission.upsert({
      where: { teamId: membership.teamId },
      update: {
        ...parsed.data,
        // Keep trackId in sync with the team's current track
        trackId: membership.team.trackId,
        status: "draft",
      },
      create: {
        teamId: membership.teamId,
        trackId: membership.team.trackId,
        ...parsed.data,
        status: "draft",
      },
    });
    return { data: { id: submission.id } };
  } catch {
    return { error: "Failed to save submission. Please try again." };
  }
}

// ─── Final submit ──────────────────────────────────────────────────────────

export async function submitProject(): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          submission: true,
          track: true,
          roomBookings: true,
        },
      },
    },
  });

  if (!membership) return { error: "You must be on a team to submit" };

  const { team } = membership;

  if (!team.trackId) {
    return { error: "Your team must select a challenge track before submitting" };
  }

  // CRITICAL: Check if team has booked a hacking space
  if (team.roomBookings.length === 0) {
    return { error: "Your team must book a hacking space before submitting. Visit the Team page to scan a room QR code." };
  }

  if (!team.submission) {
    return { error: "Save a draft first before submitting" };
  }
  if (team.submission.status === "submitted") {
    return { error: "Your project has already been submitted" };
  }
  if (team.submission.status === "reviewed") {
    return { error: "Your project has already been reviewed" };
  }

  // Re-validate the stored data meets minimum requirements
  if (!team.submission.title || team.submission.title.length < 3) {
    return { error: "Project title is too short — update your draft first" };
  }
  if (!team.submission.description || team.submission.description.length < 20) {
    return { error: "Project description is too short — update your draft first" };
  }

  await db.submission.update({
    where: { id: team.submission.id },
    data: { status: "submitted" },
  });

  return { data: true };
}

// ─── Withdraw (revert submitted → draft) ──────────────────────────────────

export async function withdrawSubmission(): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: { team: { include: { submission: true } } },
  });

  if (!membership?.team.submission) return { error: "No submission found" };

  const { status } = membership.team.submission;
  if (status === "reviewed") {
    return { error: "Reviewed projects cannot be withdrawn" };
  }
  if (status !== "submitted") {
    return { error: "Only submitted projects can be withdrawn" };
  }

  await db.submission.update({
    where: { id: membership.team.submission.id },
    data: { status: "draft" },
  });

  return { data: true };
}

// ─── Read ──────────────────────────────────────────────────────────────────

export async function getMySubmission() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          submission: { include: { track: true } },
        },
      },
    },
  });

  return membership?.team.submission ?? null;
}

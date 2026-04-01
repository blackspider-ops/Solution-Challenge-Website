"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createTeamSchema,
  joinTeamSchema,
  transferLeadershipSchema,
  updateTrackSchema,
} from "@/lib/schemas/team";

const MAX_TEAM_SIZE = 4;

/** Generate a short 6-character uppercase invite code */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Ensure invite code is unique — retry up to 5 times */
async function uniqueInviteCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateInviteCode();
    const exists = await db.team.findUnique({ where: { inviteCode: code } });
    if (!exists) return code;
  }
  throw new Error("Could not generate a unique invite code");
}

// ─── Create ────────────────────────────────────────────────────────────────

export async function createTeam(
  input: unknown
): Promise<{ error: string } | { data: { id: string; inviteCode: string } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = createTeamSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { name, trackId } = parsed.data;

  // One team per user
  const existing = await db.teamMember.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) return { error: "You are already on a team" };

  try {
    const inviteCode = await uniqueInviteCode();
    const team = await db.team.create({
      data: {
        name,
        trackId,
        leaderId: session.user.id,
        inviteCode,
        members: { create: { userId: session.user.id } },
      },
    });
    return { data: { id: team.id, inviteCode: team.inviteCode } };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: "A team with that name already exists" };
    }
    return { error: "Failed to create team. Please try again." };
  }
}

// ─── Join ──────────────────────────────────────────────────────────────────

export async function joinTeam(
  input: unknown
): Promise<{ error: string } | { data: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = joinTeamSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { code } = parsed.data;

  // Already on a team?
  const existing = await db.teamMember.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) return { error: "You are already on a team" };

  // Look up by invite code (case-insensitive) OR by team ID
  const normalised = code.trim().toUpperCase();
  const team = await db.team.findFirst({
    where: {
      OR: [
        { inviteCode: normalised },
        { id: code.trim() },
      ],
    },
  });

  if (!team) return { error: "Team not found. Check the invite code and try again." };

  // Use a transaction to atomically check size and add member — prevents race conditions
  try {
    const member = await db.$transaction(async (tx) => {
      const count = await tx.teamMember.count({ where: { teamId: team.id } });
      if (count >= MAX_TEAM_SIZE) {
        throw Object.assign(new Error("full"), { code: "TEAM_FULL" });
      }
      return tx.teamMember.create({
        data: { teamId: team.id, userId: session.user.id },
      });
    });
    return { data: { id: member.id } };
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err.code === "TEAM_FULL") return { error: "This team is full (maximum 4 members)" };
    if (err.code === "P2002") return { error: "You are already on a team" };
    return { error: "Failed to join team. Please try again." };
  }
}

// ─── Leave ─────────────────────────────────────────────────────────────────

export async function leaveTeam(): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          _count: { select: { members: true } },
          submission: { select: { status: true } },
        },
      },
    },
  });
  if (!membership) return { error: "You are not on a team" };

  const isLeader = membership.team.leaderId === session.user.id;
  const memberCount = membership.team._count.members;
  const submissionStatus = membership.team.submission?.status;

  // Block leaving if the team has a submitted or reviewed project
  if (submissionStatus === "submitted" || submissionStatus === "reviewed") {
    return {
      error: isLeader
        ? "Your team has a submitted project. Withdraw the submission before disbanding."
        : "Your team has a submitted project. You cannot leave at this stage.",
    };
  }

  if (isLeader && memberCount > 1) {
    return {
      error:
        "You are the team leader. Transfer leadership to another member before leaving.",
    };
  }

  if (isLeader && memberCount === 1) {
    // Last member — disband the team
    await db.team.delete({ where: { id: membership.teamId } });
    return { data: true };
  }

  await db.teamMember.delete({ where: { userId: session.user.id } });
  return { data: true };
}

// ─── Remove member (leader only) ──────────────────────────────────────────

export async function removeMember(
  targetUserId: string
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (targetUserId === session.user.id) return { error: "Use 'Leave team' to remove yourself" };

  const myMembership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: { team: true },
  });
  if (!myMembership) return { error: "You are not on a team" };
  if (myMembership.team.leaderId !== session.user.id) {
    return { error: "Only the team leader can remove members" };
  }

  const targetMembership = await db.teamMember.findUnique({
    where: { userId: targetUserId },
  });
  if (!targetMembership || targetMembership.teamId !== myMembership.teamId) {
    return { error: "That user is not on your team" };
  }

  await db.teamMember.delete({ where: { userId: targetUserId } });
  return { data: true };
}

// ─── Transfer leadership ───────────────────────────────────────────────────

export async function transferLeadership(
  input: unknown
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = transferLeadershipSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { newLeaderId } = parsed.data;
  if (newLeaderId === session.user.id) return { error: "You are already the leader" };

  const myMembership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: { team: true },
  });
  if (!myMembership) return { error: "You are not on a team" };
  if (myMembership.team.leaderId !== session.user.id) {
    return { error: "Only the current leader can transfer leadership" };
  }

  // Verify new leader is on the same team
  const newLeaderMembership = await db.teamMember.findUnique({
    where: { userId: newLeaderId },
  });
  if (!newLeaderMembership || newLeaderMembership.teamId !== myMembership.teamId) {
    return { error: "That user is not on your team" };
  }

  await db.team.update({
    where: { id: myMembership.teamId },
    data: { leaderId: newLeaderId },
  });
  return { data: true };
}

// ─── Update track (leader only) ────────────────────────────────────────────

export async function updateTeamTrack(
  input: unknown
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = updateTrackSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { trackId } = parsed.data;

  const myMembership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: { team: { include: { submission: true } } },
  });
  if (!myMembership) return { error: "You are not on a team" };
  if (myMembership.team.leaderId !== session.user.id) {
    return { error: "Only the team leader can change the track" };
  }
  if (myMembership.team.submission?.status === "submitted") {
    return { error: "Cannot change track after submitting your project" };
  }

  // Verify track exists
  const track = await db.track.findUnique({ where: { id: trackId } });
  if (!track) return { error: "Track not found" };

  await db.team.update({
    where: { id: myMembership.teamId },
    data: { trackId },
  });

  // If there's a draft submission, update its trackId too
  if (myMembership.team.submission) {
    await db.submission.update({
      where: { teamId: myMembership.teamId },
      data: { trackId },
    });
  }

  return { data: true };
}

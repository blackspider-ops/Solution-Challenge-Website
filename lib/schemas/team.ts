import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be under 50 characters")
    .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, hyphens and underscores"),
  trackId: z.string().min(1, "Please select a track"),
});

// Join accepts either a full cuid team ID or a short invite code (6 uppercase chars)
export const joinTeamSchema = z.object({
  code: z
    .string()
    .min(1, "Enter a team ID or invite code")
    .max(100, "Code is too long"),
});

export const transferLeadershipSchema = z.object({
  newLeaderId: z.string().min(1, "Select a member to transfer leadership to"),
});

export const updateTrackSchema = z.object({
  trackId: z.string().min(1, "Please select a track"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
export type TransferLeadershipInput = z.infer<typeof transferLeadershipSchema>;
export type UpdateTrackInput = z.infer<typeof updateTrackSchema>;

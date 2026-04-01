/**
 * Canonical event schedule configuration.
 * All timeline data, milestone logic, and schedule-derived values
 * are computed from these two source-of-truth constants.
 *
 * To change the schedule, edit EVENT_START and EVENT_END here only.
 * Everything else (timeline section, seed, dashboard) reads from this file.
 */

// ─── Source of truth ────────────────────────────────────────────────────────

/** April 11, 7:00 PM Eastern */
export const EVENT_START = new Date("2025-04-11T19:00:00-04:00");

/** April 12, 12:00 PM Eastern */
export const EVENT_END = new Date("2025-04-12T12:00:00-04:00");

// ─── Derived milestones ──────────────────────────────────────────────────────

/** Team formation + prompt release: 1 hour after EVENT_START */
export const TEAM_FORMATION = new Date(EVENT_START.getTime() + 60 * 60 * 1000);

/** Judging starts at EVENT_END */
export const JUDGING_START = EVENT_END;

/** Submission deadline: 2 hours before judging */
export const SUBMISSION_DEADLINE = new Date(JUDGING_START.getTime() - 2 * 60 * 60 * 1000);

// ─── Display helpers ─────────────────────────────────────────────────────────

export const SCHEDULE = {
  eventStart:          { label: "April 11 · 7:00 PM",  iso: EVENT_START.toISOString() },
  teamFormation:       { label: "April 11 · 8:00 PM",  iso: TEAM_FORMATION.toISOString() },
  submissionDeadline:  { label: "April 12 · 10:00 AM", iso: SUBMISSION_DEADLINE.toISOString() },
  judgingStart:        { label: "April 12 · 12:00 PM", iso: JUDGING_START.toISOString() },
} as const;

// ─── Timeline steps (used by both the public section and the seed) ───────────

export type TimelineStep = {
  title: string;
  date: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  order: number;
  icon: "UserPlus" | "Zap" | "Users" | "Upload" | "Trophy";
};

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    icon: "UserPlus",
    title: "Registration",
    date: "Before April 11",
    description:
      "Sign up and register for the event. All skill levels are welcome — solo or as a team.",
    status: "active",
    order: 0,
  },
  {
    icon: "Zap",
    title: "Event Kickoff",
    date: SCHEDULE.eventStart.label,
    description:
      "The hackathon begins at the ECoRE Building, University Park, PA. Opening ceremony, rules briefing, and participant check-in.",
    status: "upcoming",
    order: 1,
  },
  {
    icon: "Users",
    title: "Team Formation & Prompts",
    date: SCHEDULE.teamFormation.label,
    description:
      "New participants form teams (1 hour after kickoff). Challenge prompts are released simultaneously. Hacking officially begins.",
    status: "upcoming",
    order: 2,
  },
  {
    icon: "Upload",
    title: "Submission Deadline",
    date: SCHEDULE.submissionDeadline.label,
    description: `All project submissions must be completed by ${SCHEDULE.submissionDeadline.label} — exactly 2 hours before judging begins. No late submissions accepted.`,
    status: "upcoming",
    order: 3,
  },
  {
    icon: "Trophy",
    title: "Judging & Awards",
    date: SCHEDULE.judgingStart.label,
    description:
      "Expert judges evaluate all submitted projects. Winning teams advance to the North America regional round held by Google.",
    status: "upcoming",
    order: 4,
  },
];

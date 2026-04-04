import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckCircle, Clock, Users, Upload, QrCode, AlertCircle, Megaphone, Pin, ArrowRight, CalendarDays, UserCheck } from "lucide-react";
import Link from "next/link";
import { RegisterButton } from "@/components/dashboard/register-button";
import { getPublishedAnnouncements } from "@/lib/actions/announcement";
import { getMyFormResponse } from "@/lib/actions/form-builder";
import { getMyVolunteerRegistration, getVolunteerPreFillData } from "@/lib/actions/volunteer";
import { getMyVolunteerFormResponse } from "@/lib/actions/volunteer-form-builder";
import { VolunteerRegistrationDialog } from "@/components/dashboard/volunteer-registration-form";
import { SCHEDULE } from "@/lib/event-config";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [registration, teamMembership, announcements, formSections, formResponse, volunteerRegistration, volunteerPreFillData, volunteerFormSections, volunteerFormResponse] = await Promise.all([
    db.registration.findUnique({
      where: { userId: session.user.id },
      include: { ticket: { include: { checkIn: true } } },
    }),
    db.teamMember.findUnique({
      where: { userId: session.user.id },
      include: {
        team: {
          include: {
            submission: { select: { status: true } },
            track: { select: { name: true } },
            _count: { select: { members: true } },
          },
        },
      },
    }),
    getPublishedAnnouncements(5),
    db.formSection.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        questions: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    getMyFormResponse(),
    getMyVolunteerRegistration(),
    getVolunteerPreFillData(),
    db.volunteerFormSection.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        questions: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    getMyVolunteerFormResponse(),
  ]);

  const team = teamMembership?.team ?? null;
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {registration
            ? "Here's your event overview."
            : "Complete your registration to get started."}
        </p>
      </div>

      {/* Registration CTA */}
      {!registration && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            You&apos;re not registered yet
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Register to get your QR ticket and unlock team formation and project submission.
          </p>
          <RegisterButton 
            sections={formSections} 
            existingResponse={formResponse}
            userName={session.user.name || undefined}
            userEmail={session.user.email || undefined}
          />
        </div>
      )}

      {/* Volunteer Registration CTA */}
      {!volunteerRegistration && volunteerFormSections.length > 0 && (
        <div className="rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Interested in Volunteering?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Help make Solution Challenge 2026 a success! Register as a volunteer to support the event.
          </p>
          <VolunteerRegistrationDialog
            sections={volunteerFormSections}
            existingResponse={volunteerFormResponse}
            preFillData={volunteerPreFillData || undefined}
            userEmail={session.user.email || undefined}
          >
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
              <UserCheck className="w-4 h-4" />
              Register as Volunteer
            </button>
          </VolunteerRegistrationDialog>
        </div>
      )}

      {/* Volunteer Status Card */}
      {volunteerRegistration && volunteerRegistration.completed && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Volunteer Registration</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 font-medium">
                  Registered
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for volunteering! {registration ? "Access the volunteer panel from the sidebar." : "Complete event registration to access the volunteer panel."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status cards */}
      {registration && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatusCard
            icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
            label="Registration"
            value={registration.status}
            badge={registration.status === "confirmed" ? "confirmed" : "pending"}
          />
          <StatusCard
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="Team"
            value={team ? team.name : "No team yet"}
            sub={team ? `${team._count.members}/4 members · ${team.track?.name ?? "No track"}` : "Create or join a team"}
            href="/dashboard/team"
          />
          <StatusCard
            icon={<Upload className="w-5 h-5 text-violet-500" />}
            label="Submission"
            value={team?.submission?.status ?? "Not started"}
            badge={team?.submission?.status}
            href="/dashboard/submission"
          />
        </div>
      )}

      {/* Quick actions */}
      {registration && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/ticket"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">View QR Ticket</p>
              <p className="text-xs text-muted-foreground">
                {registration.ticket?.checkIn
                  ? "✓ Checked in"
                  : "Show at event entrance"}
              </p>
            </div>
          </Link>

          <a
            href="https://gdg.community.dev/events/details/google-gdg-on-campus-pennsylvania-state-university-state-college-united-states-presents-gdg-penn-state-solution-challenge-hackathon-innovate-for-impact/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:shadow-lg transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors shrink-0">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">RSVP on GDG Website</p>
              <p className="text-xs text-muted-foreground">
                Confirm your attendance
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>

          <Link
            href="/dashboard/team"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shrink-0">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                {team ? "Manage Team" : "Create or Join Team"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {team
                  ? `${team.name} · ${team._count.members}/4 members`
                  : "Up to 4 members per team"}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Event schedule quick-reference */}
      {registration && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Event Schedule</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: "Kickoff",                time: SCHEDULE.eventStart.label,         note: "ECoRE Building" },
              { label: "Team Formation & Prompts",time: SCHEDULE.teamFormation.label,      note: "1 hr after kickoff" },
              { label: "Submission Deadline",     time: SCHEDULE.submissionDeadline.label, note: "2 hrs before judging" },
              { label: "Judging & Awards",        time: SCHEDULE.judgingStart.label,       note: "Winners advance to regionals" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-xs">{item.label}</p>
                  <p className="text-primary text-xs font-semibold">{item.time}</p>
                  <p className="text-muted-foreground text-xs">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
          </div>
          {announcements.length > 0 && (
            <Link
              href="/dashboard/announcements"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No announcements yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a: {
              id: string; title: string; body: string; pinned: boolean;
              createdAt: Date; createdBy: { name: string | null };
            }) => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border bg-card transition-colors ${
                  a.pinned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {a.pinned && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
                      <p className="font-medium text-foreground">{a.title}</p>
                      {a.pinned && (
                        <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.body}</p>
                    {a.createdBy.name && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Posted by {a.createdBy.name}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <Link
              href="/dashboard/announcements"
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              View all announcements <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  pending:   "bg-amber-500/10 text-amber-700 border-amber-500/20",
  waitlisted:"bg-orange-500/10 text-orange-700 border-orange-500/20",
  draft:     "bg-muted text-muted-foreground border-border",
  submitted: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  reviewed:  "bg-violet-500/10 text-violet-700 border-violet-500/20",
};

function StatusCard({
  icon, label, value, sub, badge, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  href?: string;
}) {
  const content = (
    <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors h-full">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-foreground capitalize">{value}</p>
        {badge && BADGE_STYLES[badge] && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${BADGE_STYLES[badge]}`}>
            {badge}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
}

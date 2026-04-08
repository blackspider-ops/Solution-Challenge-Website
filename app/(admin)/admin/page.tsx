import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import {
  Users, CheckCircle, Upload, Megaphone,
  UserCheck, ArrowRight, Clock,
} from "lucide-react";
import Link from "next/link";
import { getEventSettings } from "@/lib/actions/event-settings";
import { EmailToggle } from "@/components/admin/email-toggle";

export default async function AdminOverviewPage() {
  const session = await requireAdmin();

  // Check if current user is super admin
  const isSuperAdmin = 
    session.user?.name === "Tejas Singhal" && 
    session.user?.email?.endsWith("@psu.edu");

  const [
    totalUsers,
    confirmedRegistrations,
    waitlistedRegistrations,
    checkedIn,
    totalTeams,
    submittedProjects,
    draftProjects,
    publishedAnnouncements,
    recentRegistrations,
    recentSubmissions,
    eventSettings,
  ] = await Promise.all([
    db.user.count({ where: { role: "participant" } }),
    db.registration.count({ where: { status: "confirmed" } }),
    db.registration.count({ where: { status: "waitlisted" } }),
    db.checkIn.count(),
    db.team.count(),
    db.submission.count({ where: { status: "submitted" } }),
    db.submission.count({ where: { status: "draft" } }),
    db.announcement.count({ where: { published: true } }),
    db.registration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true, image: true } } },
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      where: { status: "submitted" },
      include: {
        team: { select: { name: true } },
        track: { select: { name: true } },
      },
    }),
    getEventSettings(),
  ]);

  const totalRegistrations = confirmedRegistrations + waitlistedRegistrations;
  const checkInPct = confirmedRegistrations > 0
    ? Math.round((checkedIn / confirmedRegistrations) * 100)
    : 0;

  const stats = [
    {
      label: "Participants",
      value: totalUsers,
      sub: `${totalRegistrations} registered`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/registrations",
    },
    {
      label: "Checked In",
      value: checkedIn,
      sub: `${checkInPct}% of registered`,
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/checkin",
    },
    {
      label: "Teams",
      value: totalTeams,
      sub: "formed so far",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/admin/teams",
    },
    {
      label: "Submissions",
      value: submittedProjects,
      sub: `${draftProjects} in draft`,
      icon: Upload,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/submissions",
    },
    {
      label: "Announcements",
      value: publishedAnnouncements,
      sub: "published",
      icon: Megaphone,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      href: "/admin/announcements",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Solution Challenge 2026 — event at a glance.</p>
      </div>

      {/* Super Admin Email Control */}
      {isSuperAdmin && (
        <EmailToggle emailsEnabled={eventSettings.emailsEnabled} maxCapacity={eventSettings.maxCapacity} />
      )}

      {/* Email Status Warning for Regular Admins */}
      {!eventSettings.emailsEnabled && !isSuperAdmin && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Emails Disabled</p>
              <p className="text-xs text-red-600">
                All email notifications are currently disabled by the super admin. No emails will be sent until re-enabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View all <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Check-in progress */}
      {confirmedRegistrations > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Check-in progress</p>
            <p className="text-sm text-muted-foreground">
              {checkedIn} / {confirmedRegistrations} ({checkInPct}%)
            </p>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
              style={{ width: `${checkInPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Registrations</h2>
            <Link
              href="/admin/registrations"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRegistrations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No registrations yet.</p>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="flex items-center gap-3">
                  {reg.user.image ? (
                    <img src={reg.user.image} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-blue-500">
                        {(reg.user.name ?? reg.user.email)[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {reg.user.name ?? reg.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{reg.user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent submissions */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Submissions</h2>
            <Link
              href="/admin/submissions"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Upload className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{sub.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.team.name} · {sub.track.name}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(sub.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

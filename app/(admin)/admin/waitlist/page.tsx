import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { WaitlistManager } from "@/components/admin/waitlist-manager";
import { getEventSettings, getWaitlistStats } from "@/lib/actions/event-settings";

export default async function WaitlistPage() {
  await requireAdmin();

  const [settings, stats, waitlistUsers] = await Promise.all([
    getEventSettings(),
    getWaitlistStats(),
    db.registration.findMany({
      where: { status: "waitlisted" },
      orderBy: { waitlistPosition: "asc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Waitlist Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage event capacity and promote users from the waitlist.
        </p>
      </div>

      <WaitlistManager
        maxCapacity={settings.maxCapacity}
        confirmedCount={stats.confirmed}
        waitlistedCount={stats.waitlisted}
        waitlistUsers={waitlistUsers}
      />
    </div>
  );
}

import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { AnnouncementManager } from "@/components/admin/announcement-manager";

export default async function AnnouncementsPage() {
  await requireAdmin();
  const announcements = await db.announcement.findMany({
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" },
    ],
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">Publish updates visible to all participants.</p>
      </div>
      <AnnouncementManager announcements={announcements} />
    </div>
  );
}

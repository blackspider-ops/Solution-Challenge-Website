import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPublishedAnnouncements } from "@/lib/actions/announcement";
import { Megaphone, Clock } from "lucide-react";
import { AnnouncementCard } from "@/components/dashboard/announcement-card";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const announcements = await getPublishedAnnouncements(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground text-sm">
            {announcements.length > 0
              ? `${announcements.length} announcement${announcements.length !== 1 ? "s" : ""}`
              : "Updates from the organizers"}
          </p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">No announcements yet</p>
          <p className="text-sm text-muted-foreground">
            Check back here for updates from the organizers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}


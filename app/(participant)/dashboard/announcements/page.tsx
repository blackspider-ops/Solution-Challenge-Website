import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPublishedAnnouncements } from "@/lib/actions/announcement";
import { Megaphone, Pin, Clock } from "lucide-react";

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

type AnnouncementCardProps = {
  announcement: {
    id: string;
    title: string;
    body: string;
    pinned: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: { name: string | null };
  };
};

function AnnouncementCard({ announcement: a }: AnnouncementCardProps) {
  const wasEdited = a.updatedAt.getTime() - a.createdAt.getTime() > 5000;

  return (
    <div
      className={`rounded-2xl border bg-card p-6 transition-colors ${
        a.pinned
          ? "border-primary/30 bg-primary/5"
          : "border-border hover:border-border/80"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          a.pinned ? "bg-primary/10" : "bg-muted"
        }`}>
          {a.pinned ? (
            <Pin className="w-4 h-4 text-primary" />
          ) : (
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{a.title}</h3>
              {a.pinned && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {new Date(a.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Full body — no truncation on the dedicated page */}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {a.body}
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {a.createdBy.name && <span>Posted by {a.createdBy.name}</span>}
            {wasEdited && <span>· Edited {new Date(a.updatedAt).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

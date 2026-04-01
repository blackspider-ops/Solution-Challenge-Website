import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { TrackVisibilityManager } from "@/components/admin/track-visibility-manager";
import { Eye, EyeOff } from "lucide-react";

export default async function AdminTracksPage() {
  await requireAdmin();

  const tracks = await db.track.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      visible: true,
      order: true,
      icon: true,
      gradient: true,
    },
  });

  const visibleCount = tracks.filter((t) => t.visible).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Track Visibility</h1>
        <p className="text-muted-foreground mt-1">
          Control which track detail pages are publicly accessible.
          Hidden tracks are completely invisible to non-admin users — no content is sent to the client.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-foreground">Visible</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{visibleCount}</p>
          <p className="text-xs text-muted-foreground">publicly accessible</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">Hidden</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{tracks.length - visibleCount}</p>
          <p className="text-xs text-muted-foreground">admin-only preview</p>
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">How hiding works</p>
        <p className="text-blue-600 text-xs leading-relaxed">
          Hidden tracks return a 404 for all non-admin requests — no content is included in the HTML,
          no JavaScript bundle, and nothing is accessible via browser devtools. The protection is
          enforced entirely on the server before any response is sent.
          Admins can preview hidden tracks at{" "}
          <code className="bg-blue-500/10 px-1 rounded">/tracks/[slug]</code> while logged in.
        </p>
      </div>

      <TrackVisibilityManager tracks={tracks} />
    </div>
  );
}

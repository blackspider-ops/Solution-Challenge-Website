import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Upload, Github, Globe, Video } from "lucide-react";

type SubmissionRow = {
  id: string;
  title: string;
  description: string;
  repoUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  team: { name: string };
  track: { name: string };
};

const STATUS_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  draft:     "secondary",
  submitted: "default",
  reviewed:  "outline",
};

export default async function SubmissionsPage() {
  await requireAdmin();
  const submissions = await db.submission.findMany({
    orderBy: [
      // submitted first, then draft, then reviewed
      { status: "asc" },
      { updatedAt: "desc" },
    ],
    include: {
      team: { select: { name: true } },
      track: { select: { name: true } },
    },
  });

  const counts = {
    total:     submissions.length,
    submitted: submissions.filter((s: SubmissionRow) => s.status === "submitted").length,
    draft:     submissions.filter((s: SubmissionRow) => s.status === "draft").length,
    reviewed:  submissions.filter((s: SubmissionRow) => s.status === "reviewed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Submissions</h1>
        <p className="text-muted-foreground mt-1">{counts.total} total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Submitted", value: counts.submitted, color: "text-blue-500",   bg: "bg-blue-500/10" },
          { label: "Draft",     value: counts.draft,     color: "text-muted-foreground", bg: "bg-muted" },
          { label: "Reviewed",  value: counts.reviewed,  color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border border-border bg-card">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No submissions yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Team</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Track</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Links</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(submissions as SubmissionRow[]).map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-foreground truncate">{sub.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {sub.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {sub.team.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {sub.track.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={STATUS_BADGE[sub.status] ?? "secondary"}
                      className="capitalize"
                    >
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {sub.repoUrl && (
                        <a
                          href={sub.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="GitHub repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {sub.demoUrl && (
                        <a
                          href={sub.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Live demo"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {sub.videoUrl && (
                        <a
                          href={sub.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Video demo"
                        >
                          <Video className="w-4 h-4" />
                        </a>
                      )}
                      {!sub.repoUrl && !sub.demoUrl && !sub.videoUrl && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(sub.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SubmissionForm } from "@/components/dashboard/submission-form";
import { Upload, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SubmissionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          track: { select: { id: true, name: true } },
          submission: {
            select: {
              id: true,
              title: true,
              description: true,
              repoUrl: true,
              demoUrl: true,
              videoUrl: true,
              status: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  const team = membership?.team ?? null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Submission</h1>
          <p className="text-sm text-muted-foreground">
            {team?.submission
              ? `Status: ${team.submission.status}`
              : "One submission per team"}
          </p>
        </div>
      </div>

      {/* No team */}
      {!membership && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No team yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            You need to be on a team before you can submit a project.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <Link href="/dashboard/team">Create or join a team</Link>
          </Button>
        </div>
      )}

      {/* Has team but no track */}
      {membership && !team?.track && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700">No challenge track selected</p>
            <p className="text-xs text-amber-600 mt-1">
              Your team leader needs to select a challenge track on the{" "}
              <Link href="/dashboard/team" className="underline font-medium">
                Team page
              </Link>{" "}
              before you can submit.
            </p>
          </div>
        </div>
      )}

      {/* Submission form — show even without track so user can draft */}
      {membership && (
        <SubmissionForm
          existing={team?.submission ?? null}
          trackName={team?.track?.name ?? null}
        />
      )}
    </div>
  );
}

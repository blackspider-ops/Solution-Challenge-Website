import { requireJudge } from "@/lib/judge-guard";
import { getSubmissionsForJudging, getJudgingCriteria } from "@/lib/actions/judging";
import { SubmissionJudgingCard } from "@/components/judge/submission-judging-card";
import { Card } from "@/components/ui/card";
import { Award, FileCheck, FileX, Scale } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function JudgePage() {
  const session = await requireJudge();
  const judgeId = session.user?.id!;

  const [submissionsResult, criteriaResult] = await Promise.all([
    getSubmissionsForJudging(),
    getJudgingCriteria(),
  ]);

  const submissions = "data" in submissionsResult ? submissionsResult.data : [];
  const allCriteria = "data" in criteriaResult ? criteriaResult.data : [];
  const criteria = allCriteria.filter((c) => c.active);

  // Calculate stats
  const totalSubmissions = submissions.length;
  const judgedByMe = submissions.filter((s) =>
    s.scores.some((score) => score.judge.email === session.user?.email)
  ).length;
  const unjudgedByMe = totalSubmissions - judgedByMe;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Judge Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Review and score submitted projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSubmissions}</p>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{judgedByMe}</p>
              <p className="text-xs text-muted-foreground">Judged by You</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <FileX className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unjudgedByMe}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Criteria Info */}
      {criteria.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No judging criteria configured yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Contact an admin to set up judging criteria
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-4 bg-muted/30">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Judging Criteria ({criteria.length})
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {criteria.map((c) => (
                <div key={c.id} className="text-sm">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Max: {c.maxScore} • Weight: {c.weight}x
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Submissions */}
          {submissions.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileX className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No submissions to judge yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Submissions</h2>
              {submissions.map((submission) => {
                // Get existing scores by this judge
                const myScores = submission.scores
                  .filter((s) => s.judge.email === session.user?.email)
                  .map((s) => ({
                    criteriaId: s.criteria.id,
                    score: s.score,
                    comment: s.comment,
                  }));

                return (
                  <SubmissionJudgingCard
                    key={submission.id}
                    submission={submission}
                    criteria={criteria}
                    existingScores={myScores}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

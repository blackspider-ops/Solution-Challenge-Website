import { requireAdmin } from "@/lib/admin-guard";
import { getJudgingCriteria, getJudgingStats } from "@/lib/actions/judging";
import { JudgingCriteriaManager } from "@/components/admin/judging-criteria-manager";
import { Card } from "@/components/ui/card";
import { Award, Users, FileCheck, FileX } from "lucide-react";

export default async function JudgingCriteriaPage() {
  await requireAdmin();

  const [criteriaResult, statsResult] = await Promise.all([
    getJudgingCriteria(),
    getJudgingStats(),
  ]);

  const criteria = "data" in criteriaResult ? criteriaResult.data : [];
  const stats = "data" in statsResult ? statsResult.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Judging Criteria</h1>
        <p className="text-muted-foreground mt-1">
          Configure scoring criteria for judges to evaluate submissions
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeCriteria}</p>
                <p className="text-xs text-muted-foreground">Active Criteria</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalJudges}</p>
                <p className="text-xs text-muted-foreground">Judges</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.judgedSubmissions}</p>
                <p className="text-xs text-muted-foreground">Judged</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <FileX className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unjudgedSubmissions}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Criteria Manager */}
      <JudgingCriteriaManager criteria={criteria} />
    </div>
  );
}

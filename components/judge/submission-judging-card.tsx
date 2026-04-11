"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Github, 
  Globe, 
  Video, 
  Award, 
  Save, 
  CheckCircle2, 
  Circle,
  Users,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { submitJudgingScore } from "@/lib/actions/judging";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type Criteria = {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
};

type Score = {
  id: string;
  score: number;
  comment: string | null;
  judge: {
    name: string | null;
    email: string | null;
  };
  criteria: {
    id: string;
    name: string;
  };
};

type ExistingScore = {
  criteriaId: string;
  score: number;
  comment: string | null;
};

type Submission = {
  id: string;
  title: string;
  description: string;
  repoUrl: string | null;
  forkedRepoUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  team: {
    name: string;
  };
  track: {
    name: string;
  };
  scores: Score[];
};

export function SubmissionJudgingCard({
  submission,
  criteria,
  existingScores,
  currentJudgeEmail,
}: {
  submission: Submission;
  criteria: Criteria[];
  existingScores: ExistingScore[];
  currentJudgeEmail: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [scores, setScores] = useState<Record<string, { score: number; comment: string }>>(
    () => {
      const initial: Record<string, { score: number; comment: string }> = {};
      criteria.forEach((c) => {
        const existing = existingScores.find((s) => s.criteriaId === c.id);
        initial[c.id] = {
          score: existing?.score ?? 0,
          comment: existing?.comment ?? "",
        };
      });
      return initial;
    }
  );

  // Calculate aggregate scores
  const aggregateScores = criteria.map((c) => {
    const criteriaScores = submission.scores.filter((s) => s.criteria.id === c.id);
    const avg = criteriaScores.length > 0
      ? criteriaScores.reduce((sum, s) => sum + s.score, 0) / criteriaScores.length
      : 0;
    return {
      criteriaId: c.id,
      criteriaName: c.name,
      average: avg,
      count: criteriaScores.length,
      scores: criteriaScores,
    };
  });

  const totalJudges = new Set(submission.scores.map((s) => s.judge.email)).size;
  const myScoresCount = existingScores.filter((s) => s.score > 0).length;
  const isComplete = myScoresCount === criteria.length;

  const myTotalScore = criteria.reduce((sum, c) => {
    const score = scores[c.id]?.score ?? 0;
    return sum + score * c.weight;
  }, 0);

  const aggregateTotalScore = criteria.reduce((sum, c) => {
    const agg = aggregateScores.find((a) => a.criteriaId === c.id);
    return sum + (agg?.average ?? 0) * c.weight;
  }, 0);

  const maxPossibleScore = criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0);

  function handleScoreChange(criteriaId: string, score: number, maxScore: number) {
    const clampedScore = Math.max(0, Math.min(maxScore, score));
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], score: clampedScore },
    }));
  }

  function handleCommentChange(criteriaId: string, comment: string) {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], comment },
    }));
  }

  async function handleSubmitAll() {
    startTransition(async () => {
      let hasError = false;

      for (const c of criteria) {
        const data = scores[c.id];
        const result = await submitJudgingScore({
          submissionId: submission.id,
          criteriaId: c.id,
          score: data.score,
          comment: data.comment || undefined,
        });

        if ("error" in result) {
          toast.error(`${c.name}: ${result.error}`);
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        toast.success("All scores saved successfully");
        setIsOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {submission.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-medium">
                  {submission.team.name}
                </Badge>
                <Badge variant="secondary">{submission.track.name}</Badge>
                {isComplete && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {!isComplete && myScoresCount > 0 && (
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    <Circle className="w-3 h-3 mr-1 fill-orange-500" />
                    In Progress ({myScoresCount}/{criteria.length})
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {submission.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {totalJudges} {totalJudges === 1 ? "Judge" : "Judges"}
                </span>
              </div>
              {aggregateTotalScore > 0 && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    {aggregateTotalScore.toFixed(1)}/{maxPossibleScore.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">avg</span>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {submission.forkedRepoUrl && (
                <a
                  href={submission.forkedRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Forked Repo (Frozen)
                </a>
              )}
              {submission.repoUrl && !submission.forkedRepoUrl && (
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Repo
                </a>
              )}
              {submission.demoUrl && (
                <a
                  href={submission.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Demo
                </a>
              )}
              {submission.videoUrl && (
                <a
                  href={submission.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Video
                </a>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant={isComplete ? "outline" : "default"} className="shrink-0">
                <Award className="w-4 h-4 mr-2" />
                {isComplete ? "View Scores" : "Score Project"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl">{submission.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 flex-wrap">
                  <span>Team: {submission.team.name}</span>
                  <span>•</span>
                  <span>Track: {submission.track.name}</span>
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="score">Your Scores</TabsTrigger>
                  <TabsTrigger value="aggregate">All Judges</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto mt-4">
                  {/* Project Details Tab */}
                  <TabsContent value="details" className="space-y-4 mt-0">
                    <Card className="p-6">
                      <h4 className="font-semibold mb-3">Description</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {submission.description}
                      </p>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-3">Project Links</h4>
                      <div className="space-y-3">
                        {submission.forkedRepoUrl && (
                          <a
                            href={submission.forkedRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                          >
                            <Github className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                              <p className="font-bold text-sm text-foreground">Forked Repository (Frozen at Submission)</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {submission.forkedRepoUrl}
                              </p>
                            </div>
                          </a>
                        )}
                        {submission.repoUrl && (
                          <a
                            href={submission.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                          >
                            <Github className="w-5 h-5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">Original Repository {submission.forkedRepoUrl && <span className="text-xs text-muted-foreground">(may have been edited)</span>}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {submission.repoUrl}
                              </p>
                            </div>
                          </a>
                        )}
                        {submission.demoUrl && (
                          <a
                            href={submission.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">Live Demo</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {submission.demoUrl}
                              </p>
                            </div>
                          </a>
                        )}
                        {submission.videoUrl && (
                          <a
                            href={submission.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                          >
                            <Video className="w-5 h-5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">Video Demo</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {submission.videoUrl}
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Your Scores Tab */}
                  <TabsContent value="score" className="space-y-4 mt-0">
                    {criteria.map((c) => {
                      const currentScore = scores[c.id]?.score ?? 0;
                      const percentage = (currentScore / c.maxScore) * 100;
                      
                      return (
                        <Card key={c.id} className="p-5 bg-muted/30">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <Label className="text-lg font-semibold">{c.name}</Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {c.description}
                                  </p>
                                </div>
                                <Badge variant="outline" className="ml-2 shrink-0">
                                  Weight: {c.weight}x
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex-1">
                                  <Progress value={percentage} className="h-2" />
                                </div>
                                <span className="text-sm font-semibold min-w-[60px] text-right">
                                  {currentScore}/{c.maxScore}
                                </span>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`score-${c.id}`} className="text-sm mb-2 block">
                                  Score (0-{c.maxScore})
                                </Label>
                                <Input
                                  id={`score-${c.id}`}
                                  type="number"
                                  min="0"
                                  max={c.maxScore}
                                  value={currentScore}
                                  onChange={(e) =>
                                    handleScoreChange(c.id, parseInt(e.target.value) || 0, c.maxScore)
                                  }
                                  className="text-lg font-semibold"
                                />
                              </div>
                              <div>
                                <Label className="text-sm mb-2 block">Weighted Score</Label>
                                <div className="h-10 px-3 rounded-md border bg-muted flex items-center justify-center">
                                  <span className="text-lg font-bold text-primary">
                                    {(currentScore * c.weight).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor={`comment-${c.id}`} className="text-sm mb-2 block">
                                <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                                Comments (optional)
                              </Label>
                              <Textarea
                                id={`comment-${c.id}`}
                                placeholder="Share your feedback..."
                                value={scores[c.id]?.comment ?? ""}
                                onChange={(e) => handleCommentChange(c.id, e.target.value)}
                                rows={3}
                                className="resize-none"
                              />
                            </div>
                          </div>
                        </Card>
                      );
                    })}

                    {/* Total Score Summary */}
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Weighted Score</p>
                          <p className="text-4xl font-bold text-primary">
                            {myTotalScore.toFixed(1)}
                            <span className="text-xl text-muted-foreground ml-2">
                              / {maxPossibleScore.toFixed(1)}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                          <p className="text-3xl font-bold">
                            {((myTotalScore / maxPossibleScore) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Button
                      onClick={handleSubmitAll}
                      disabled={isPending}
                      className="w-full"
                      size="lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isPending ? "Saving..." : "Save All Scores"}
                    </Button>
                  </TabsContent>

                  {/* Aggregate Scores Tab */}
                  <TabsContent value="aggregate" className="space-y-4 mt-0">
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Aggregate Score</p>
                          <p className="text-4xl font-bold text-primary">
                            {aggregateTotalScore.toFixed(1)}
                            <span className="text-xl text-muted-foreground ml-2">
                              / {maxPossibleScore.toFixed(1)}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total Judges</p>
                          <p className="text-3xl font-bold">{totalJudges}</p>
                        </div>
                      </div>
                    </Card>

                    {aggregateScores.map((agg) => {
                      const c = criteria.find((cr) => cr.criteriaId === agg.criteriaId);
                      if (!c) return null;

                      const percentage = (agg.average / c.maxScore) * 100;

                      return (
                        <Card key={agg.criteriaId} className="p-5">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-lg font-semibold">{agg.criteriaName}</Label>
                                <Badge variant="outline">
                                  {agg.count} {agg.count === 1 ? "Judge" : "Judges"}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Progress value={percentage} className="h-2" />
                                </div>
                                <span className="text-sm font-semibold min-w-[80px] text-right">
                                  {agg.average.toFixed(1)}/{c.maxScore}
                                </span>
                              </div>
                            </div>

                            {agg.scores.length > 0 && (
                              <div className="space-y-2">
                                <Separator />
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                  Individual Scores
                                </p>
                                {agg.scores.map((score) => (
                                  <div key={score.id} className="flex items-start justify-between text-sm">
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {score.judge.name || score.judge.email}
                                      </p>
                                      {score.comment && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">
                                          "{score.comment}"
                                        </p>
                                      )}
                                    </div>
                                    <Badge variant="secondary" className="ml-2">
                                      {score.score}/{c.maxScore}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </TabsContent>
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}

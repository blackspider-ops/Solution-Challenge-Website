"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, Globe, Video, ExternalLink, Award, Save } from "lucide-react";
import { submitJudgingScore } from "@/lib/actions/judging";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Criteria = {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
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
  demoUrl: string | null;
  videoUrl: string | null;
  team: {
    name: string;
  };
  track: {
    name: string;
  };
};

export function SubmissionJudgingCard({
  submission,
  criteria,
  existingScores,
}: {
  submission: Submission;
  criteria: Criteria[];
  existingScores: ExistingScore[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize scores from existing or default to 0
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

  function handleScoreChange(criteriaId: string, score: number) {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], score },
    }));
  }

  function handleCommentChange(criteriaId: string, comment: string) {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], comment },
    }));
  }

  async function handleSubmitScore(criteriaId: string) {
    const data = scores[criteriaId];
    if (data.score < 0) {
      toast.error("Score cannot be negative");
      return;
    }

    startTransition(async () => {
      const result = await submitJudgingScore({
        submissionId: submission.id,
        criteriaId,
        score: data.score,
        comment: data.comment || undefined,
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Score saved");
        router.refresh();
      }
    });
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
        toast.success("All scores saved");
        setIsOpen(false);
        router.refresh();
      }
    });
  }

  const totalScore = criteria.reduce((sum, c) => {
    const score = scores[c.id]?.score ?? 0;
    return sum + score * c.weight;
  }, 0);

  const maxPossibleScore = criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0);

  const isComplete = criteria.every((c) => scores[c.id]?.score > 0);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{submission.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline">{submission.team.name}</Badge>
            <Badge variant="secondary">{submission.track.name}</Badge>
            {isComplete && (
              <Badge className="bg-emerald-500">
                <Award className="w-3 h-3 mr-1" />
                Scored
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {submission.description}
          </p>

          {/* Links */}
          <div className="flex items-center gap-3 mt-3">
            {submission.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Video className="w-4 h-4" />
                Video
              </a>
            )}
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={isComplete ? "outline" : "default"}>
              <ExternalLink className="w-4 h-4 mr-2" />
              {isComplete ? "Edit Scores" : "Score"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{submission.title}</DialogTitle>
              <DialogDescription>
                Team: {submission.team.name} • Track: {submission.track.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {submission.description}
                </p>
              </div>

              {/* Scoring */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold mb-4">Score Submission</h4>
                <div className="space-y-4">
                  {criteria.map((c) => (
                    <Card key={c.id} className="p-4 bg-muted/30">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">{c.name}</Label>
                            <Badge variant="outline">
                              Max: {c.maxScore} • Weight: {c.weight}x
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {c.description}
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`score-${c.id}`} className="text-sm">
                              Score (0-{c.maxScore})
                            </Label>
                            <Input
                              id={`score-${c.id}`}
                              type="number"
                              min="0"
                              max={c.maxScore}
                              value={scores[c.id]?.score ?? 0}
                              onChange={(e) =>
                                handleScoreChange(c.id, parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSubmitScore(c.id)}
                              disabled={isPending}
                              className="w-full"
                            >
                              <Save className="w-3 h-3 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`comment-${c.id}`} className="text-sm">
                            Comments (optional)
                          </Label>
                          <Textarea
                            id={`comment-${c.id}`}
                            placeholder="Add feedback..."
                            value={scores[c.id]?.comment ?? ""}
                            onChange={(e) => handleCommentChange(c.id, e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Total Score */}
                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Weighted Score</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalScore.toFixed(1)} / {maxPossibleScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Submit All */}
                <Button
                  onClick={handleSubmitAll}
                  disabled={isPending}
                  className="w-full mt-4"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All Scores
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

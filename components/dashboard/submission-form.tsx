"use client";

import { useTransition, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, type SubmissionInput } from "@/lib/schemas/submission";
import { upsertSubmission, submitProject, withdrawSubmission } from "@/lib/actions/submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CheckCircle, FileText, Github, Globe, Video,
  AlertTriangle, RotateCcw, Send, X, Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Inline type — no @prisma/client import in client components ───────────
type ExistingSubmission = {
  id: string;
  title: string;
  description: string;
  repoUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  status: string;
  updatedAt: Date;
} | null;

interface SubmissionFormProps {
  existing: ExistingSubmission;
  trackName: string | null;
  hasRoomBooking?: boolean;
}

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  draft:     { label: "Draft",     variant: "secondary" as const, color: "text-muted-foreground" },
  submitted: { label: "Submitted", variant: "default"   as const, color: "text-blue-600" },
  reviewed:  { label: "Reviewed",  variant: "outline"   as const, color: "text-violet-600" },
};

const DESCRIPTION_MAX = 2000;

// ─── Component ─────────────────────────────────────────────────────────────
export function SubmissionForm({ existing, trackName, hasRoomBooking = false }: SubmissionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState<Date | null>(
    existing ? new Date(existing.updatedAt) : null
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const isLocked = existing?.status === "submitted" || existing?.status === "reviewed";
  const statusConfig = existing?.status ? STATUS_CONFIG[existing.status as keyof typeof STATUS_CONFIG] : null;

  const form = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title:       existing?.title       ?? "",
      description: existing?.description ?? "",
      repoUrl:     existing?.repoUrl     ?? "",
      demoUrl:     existing?.demoUrl     ?? "",
      videoUrl:    existing?.videoUrl    ?? "",
    },
  });

  // Live character count for description
  const descriptionValue = useWatch({ control: form.control, name: "description", defaultValue: existing?.description ?? "" });
  const descLen = descriptionValue?.length ?? 0;

  function handleSave(data: SubmissionInput) {
    startTransition(async () => {
      try {
        const result = await upsertSubmission(data);
        if ("error" in result) { toast.error(result.error); return; }
        setLastSaved(new Date());
        toast.success("Draft saved");
        router.refresh();
      } catch {
        toast.error("Network error — could not save draft");
      }
    });
  }

  function handleFinalSubmit() {
    startTransition(async () => {
      try {
        const values = form.getValues();
        const saveResult = await upsertSubmission(values);
        if ("error" in saveResult) { toast.error(saveResult.error); return; }

        const result = await submitProject();
        if ("error" in result) { toast.error(result.error); return; }
        toast.success("Project submitted for review!");
        setShowSubmitDialog(false);
        router.refresh();
      } catch {
        toast.error("Network error — could not submit project");
      }
    });
  }

  function handleWithdraw() {
    startTransition(async () => {
      try {
        const result = await withdrawSubmission();
        if ("error" in result) { toast.error(result.error); return; }
        toast.success("Submission withdrawn — back to draft");
        setShowWithdrawDialog(false);
        router.refresh();
      } catch {
        toast.error("Network error — could not withdraw submission");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Status banner */}
      {existing?.status === "submitted" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-700">Project submitted</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Your project is under review. You can withdraw it to make changes.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWithdrawDialog(true)}
            disabled={isPending}
            className="shrink-0 gap-1.5 text-xs border-blue-500/30 text-blue-700 hover:bg-blue-500/10"
          >
            <RotateCcw className="w-3 h-3" />
            Withdraw
          </Button>
        </div>
      )}

      {existing?.status === "reviewed" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <CheckCircle className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-violet-700">Project reviewed</p>
            <p className="text-xs text-violet-600 mt-0.5">
              Your project has been reviewed by the judges.
            </p>
          </div>
        </div>
      )}

      {/* Main form card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Project Details</h2>
          </div>
          <div className="flex items-center gap-2">
            {trackName && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                {trackName}
              </span>
            )}
            {statusConfig && (
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            )}
          </div>
        </div>

        {/* Last saved */}
        {lastSaved && !isLocked && (
          <p className="text-xs text-muted-foreground -mt-2">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}

        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Project title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...form.register("title")}
              disabled={isLocked || isPending}
              placeholder="e.g. EcoTrack — Carbon Footprint Monitor"
              maxLength={120}
            />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {(form.watch("title") ?? "").length}/120 characters
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              disabled={isLocked || isPending}
              placeholder="Describe your project — the problem it solves, how it works, the technology used, and its potential impact..."
              rows={7}
              maxLength={DESCRIPTION_MAX}
            />
            <div className="flex items-center justify-between">
              {form.formState.errors.description ? (
                <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
              )}
              <p className={`text-xs tabular-nums ${descLen > DESCRIPTION_MAX * 0.9 ? "text-amber-600" : "text-muted-foreground"}`}>
                {descLen}/{DESCRIPTION_MAX}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Label className="text-sm">Project links</Label>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="repoUrl" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> GitHub repository
                </Label>
                <Input
                  id="repoUrl"
                  {...form.register("repoUrl")}
                  disabled={isLocked || isPending}
                  placeholder="https://github.com/..."
                  className="text-sm"
                />
                {form.formState.errors.repoUrl && (
                  <p className="text-xs text-destructive">{form.formState.errors.repoUrl.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="demoUrl" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Live demo
                </Label>
                <Input
                  id="demoUrl"
                  {...form.register("demoUrl")}
                  disabled={isLocked || isPending}
                  placeholder="https://..."
                  className="text-sm"
                />
                {form.formState.errors.demoUrl && (
                  <p className="text-xs text-destructive">{form.formState.errors.demoUrl.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="videoUrl" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Video demo
                </Label>
                <Input
                  id="videoUrl"
                  {...form.register("videoUrl")}
                  disabled={isLocked || isPending}
                  placeholder="https://youtube.com/..."
                  className="text-sm"
                />
                {form.formState.errors.videoUrl && (
                  <p className="text-xs text-destructive">{form.formState.errors.videoUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isLocked && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-border">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save draft"}
              </Button>

              <Button
                type="button"
                onClick={() => setShowSubmitDialog(true)}
                disabled={isPending || !existing || !hasRoomBooking}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2"
                title={!hasRoomBooking ? "Book a hacking space first" : undefined}
              >
                <Send className="w-4 h-4" />
                {isPending ? "Submitting..." : "Submit project"}
              </Button>

              {!existing && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Save a draft first, then submit when ready
                </p>
              )}

              {existing && !hasRoomBooking && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Book a hacking space before submitting
                </p>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Submit Project for Judging
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>
                You're about to submit your project for review by the judges. After submission:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Your project will be reviewed by the judging panel</li>
                <li>You can still edit your submission if needed</li>
                <li>You can withdraw it anytime to make changes</li>
              </ul>
              <p className="text-sm font-medium text-foreground pt-2">
                Ready to submit?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinalSubmit}
              disabled={isPending}
              className="bg-gradient-to-r from-primary to-primary/90 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Withdraw Submission
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>
                Withdrawing your submission will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Revert your project to draft status</li>
                <li>Remove it from the judging queue</li>
                <li>Allow you to make changes</li>
                <li>You can resubmit anytime before the deadline</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-3">
                <p className="text-sm font-medium text-amber-700">
                  ⚠️ Important: If not resubmitted by judging time (April 12, 12:00 PM), your project will be skipped and count as an auto-withdrawal.
                </p>
              </div>
              <p className="text-sm font-medium text-foreground pt-2">
                Are you sure you want to withdraw?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isPending}
              variant="destructive"
              className="gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Withdraw Submission
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

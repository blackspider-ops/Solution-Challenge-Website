"use client";

import { useState, useTransition } from "react";
import { updateEventSettings } from "@/lib/actions/event-settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, LockOpen, Edit, FileX } from "lucide-react";

type Props = {
  submissionsOpen: boolean;
  allowSubmissionEdits: boolean;
};

export function SubmissionToggles({ submissionsOpen: initialSubmissionsOpen, allowSubmissionEdits: initialAllowEdits }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submissionsOpen, setSubmissionsOpen] = useState(initialSubmissionsOpen);
  const [allowEdits, setAllowEdits] = useState(initialAllowEdits);

  function handleToggleSubmissions() {
    const newValue = !submissionsOpen;
    
    if (!confirm(`Are you sure you want to ${newValue ? "OPEN" : "CLOSE"} submissions? ${!newValue ? "Teams will NOT be able to submit new projects!" : ""}`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateEventSettings({
          maxCapacity: 100, // dummy value, won't be updated
          registrationOpen: true, // dummy value, won't be updated
          submissionsOpen: newValue,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setSubmissionsOpen(newValue);
        toast.success(`Submissions ${newValue ? "opened" : "closed"} successfully`);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleToggleEdits() {
    const newValue = !allowEdits;
    
    if (!confirm(`Are you sure you want to ${newValue ? "ALLOW" : "PREVENT"} editing submitted projects? ${!newValue ? "Teams will NOT be able to edit their submitted projects!" : ""}`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateEventSettings({
          maxCapacity: 100, // dummy value, won't be updated
          registrationOpen: true, // dummy value, won't be updated
          allowSubmissionEdits: newValue,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setAllowEdits(newValue);
        toast.success(`Submission editing ${newValue ? "allowed" : "prevented"} successfully`);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Submission Controls</h3>
          <p className="text-sm text-amber-700">
            Super admin only - Control when teams can submit and edit projects
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Submissions Open/Close */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center gap-3">
            {submissionsOpen ? (
              <LockOpen className="w-5 h-5 text-emerald-600" />
            ) : (
              <FileX className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-foreground">Accept New Submissions</p>
              <p className="text-xs text-muted-foreground">
                {submissionsOpen 
                  ? "Teams can submit new projects" 
                  : "New submissions are blocked"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSubmissions}
              disabled={isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                submissionsOpen ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  submissionsOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${submissionsOpen ? "text-emerald-600" : "text-red-600"}`}>
              {submissionsOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        {/* Allow Edits */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center gap-3">
            {allowEdits ? (
              <Edit className="w-5 h-5 text-emerald-600" />
            ) : (
              <Lock className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-foreground">Allow Editing Submitted Projects</p>
              <p className="text-xs text-muted-foreground">
                {allowEdits 
                  ? "Teams can edit their submitted projects" 
                  : "Submitted projects are locked"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEdits}
              disabled={isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                allowEdits ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowEdits ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${allowEdits ? "text-emerald-600" : "text-red-600"}`}>
              {allowEdits ? "Allowed" : "Locked"}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-amber-600 mt-4">
        ⚠️ These controls affect all teams. Use carefully during judging or after deadlines.
      </p>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEventSettings } from "@/lib/actions/event-settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  emailsEnabled: boolean;
  maxCapacity: number;
};

export function EmailToggle({ emailsEnabled: initialEmailsEnabled, maxCapacity }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [emailsEnabled, setEmailsEnabled] = useState(initialEmailsEnabled);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);

  function handleToggleClick() {
    setPendingValue(!emailsEnabled);
    setShowDialog(true);
  }

  function handleConfirm() {
    const newValue = pendingValue;
    setShowDialog(false);

    startTransition(async () => {
      try {
        const result = await updateEventSettings({
          maxCapacity,
          registrationOpen: true,
          emailsEnabled: newValue,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setEmailsEnabled(newValue);
        toast.success(`Emails ${newValue ? "enabled" : "disabled"} successfully`);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  return (
    <>
      <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <span className="text-lg">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Super Admin Controls</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Master email kill switch - disables ALL email notifications system-wide (tickets, announcements, etc.)
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleClick}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailsEnabled ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${emailsEnabled ? "text-emerald-600" : "text-red-600"}`}>
                Emails {emailsEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingValue ? "Enable" : "Disable"} All Emails?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingValue ? (
                <>
                  This will re-enable all email notifications system-wide including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Registration confirmation emails</li>
                    <li>QR code ticket emails</li>
                    <li>Announcement notifications</li>
                    <li>All other automated emails</li>
                  </ul>
                </>
              ) : (
                <>
                  <strong className="text-destructive">Warning:</strong> This will stop ALL email notifications system-wide including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Registration confirmation emails</li>
                    <li>QR code ticket emails</li>
                    <li>Announcement notifications</li>
                    <li>All other automated emails</li>
                  </ul>
                  <p className="mt-2 font-semibold">Use this only in emergencies or for testing.</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={pendingValue ? "" : "bg-destructive hover:bg-destructive/90 text-white"}
            >
              {pendingValue ? "Enable Emails" : "Disable Emails"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

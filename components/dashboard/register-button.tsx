"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { registerForEvent } from "@/lib/actions/registration";
import { toast } from "sonner";
import { ExternalLink, CheckCircle } from "lucide-react";

const EXTERNAL_FORM_URL = "https://forms.office.com/r/EhW4bfqHFR?origin=lprLink";

export function RegisterButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);

  function handleInitialClick() {
    setShowDialog(true);
    setFormCompleted(false);
  }

  function openExternalForm() {
    window.open(EXTERNAL_FORM_URL, "_blank");
  }

  function handleFinalRegister() {
    if (!formCompleted) {
      toast.error("Please complete the external form first");
      return;
    }

    startTransition(async () => {
      const result = await registerForEvent();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("You're registered! Check your email for your QR ticket.");
      setShowDialog(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        onClick={handleInitialClick}
        disabled={isPending}
        className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-all"
      >
        Register for the event
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Registration</DialogTitle>
            <DialogDescription>
              To register for Solution Challenge, please complete the external form first.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Step 1: External Form */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  formCompleted ? "bg-emerald-500" : "bg-primary"
                }`}>
                  {formCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-white">1</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Complete External Form</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill out the required information in the Microsoft Form
                  </p>
                </div>
              </div>

              <Button
                onClick={openExternalForm}
                variant="outline"
                className="w-full gap-2"
                disabled={formCompleted}
              >
                <ExternalLink className="w-4 h-4" />
                Open Form
              </Button>

              {!formCompleted && (
                <Button
                  onClick={() => setFormCompleted(true)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  I've completed the form
                </Button>
              )}
            </div>

            {/* Step 2: Generate Ticket */}
            <div className={`rounded-lg border p-4 space-y-3 ${
              !formCompleted ? "opacity-50" : ""
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  formCompleted ? "bg-primary" : "bg-muted"
                }`}>
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Generate Your Ticket</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll create your QR code ticket and email it to you
                  </p>
                </div>
              </div>

              <Button
                onClick={handleFinalRegister}
                disabled={!formCompleted || isPending}
                className="w-full bg-gradient-to-r from-primary to-primary/90"
              >
                {isPending ? "Generating Ticket..." : "Complete Registration"}
              </Button>
            </div>

            {/* Info */}
            <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Your QR code ticket will be generated using your logged-in email and name. 
                You'll receive it via email and can add it to Apple Wallet, Google Wallet, or Samsung Wallet.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


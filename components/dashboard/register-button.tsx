"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { registerForEvent } from "@/lib/actions/registration";
import { getMyFormResponse } from "@/lib/actions/form-builder";
import { toast } from "sonner";
import { CheckCircle, FileText } from "lucide-react";
import { RegistrationForm } from "./registration-form";
import { db } from "@/lib/db";

export function RegisterButton({ 
  sections, 
  existingResponse,
  preFillData,
  userName,
  userEmail,
}: { 
  sections: any[]; 
  existingResponse: any;
  preFillData?: Record<string, any>;
  userName?: string;
  userEmail?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);
  const [formCompleted, setFormCompleted] = useState(existingResponse?.completed || false);

  useEffect(() => {
    setFormCompleted(existingResponse?.completed || false);
  }, [existingResponse]);

  function handleInitialClick() {
    setShowDialog(true);
  }

  function handleFinalRegister() {
    if (!formCompleted) {
      toast.error("Please complete the registration form first");
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Registration</DialogTitle>
            <DialogDescription>
              Fill out the registration form and generate your event ticket.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Step 1: Registration Form */}
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
                  <p className="font-medium text-sm">Complete Registration Form</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill out all required information
                  </p>
                </div>
              </div>

              {!formCompleted && (
                <RegistrationForm 
                  sections={sections} 
                  existingResponse={existingResponse}
                  preFillData={preFillData}
                  userName={userName}
                  userEmail={userEmail}
                  onComplete={() => {
                    setFormCompleted(true);
                    router.refresh();
                  }}
                />
              )}

              {formCompleted && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-700 font-medium">
                    ✓ Form completed successfully
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Generate Ticket */}
            {formCompleted && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-primary">
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
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-primary to-primary/90"
                >
                  {isPending ? "Generating Ticket..." : "Complete Registration"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


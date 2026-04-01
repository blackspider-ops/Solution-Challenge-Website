"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { registerForEvent } from "@/lib/actions/registration";
import { toast } from "sonner";

export function RegisterButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRegister() {
    startTransition(async () => {
      const result = await registerForEvent();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("You're registered! Your QR ticket is ready.");
      router.refresh();
    });
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isPending}
      className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-all"
    >
      {isPending ? "Registering..." : "Register for the event"}
    </Button>
  );
}

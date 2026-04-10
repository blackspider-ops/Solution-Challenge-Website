"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toggleSecondServings } from "@/lib/actions/food";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SecondServingsToggle({ initialValue }: { initialValue: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function handleToggle(checked: boolean) {
    setEnabled(checked);
    
    startTransition(async () => {
      const result = await toggleSecondServings(checked);
      
      if ("error" in result) {
        toast.error(result.error);
        setEnabled(!checked); // Revert on error
      } else {
        toast.success(checked ? "Second servings enabled" : "Second servings disabled");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-card">
      <Switch
        id="second-servings"
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label htmlFor="second-servings" className="text-sm cursor-pointer">
        Allow Second Servings
      </Label>
    </div>
  );
}

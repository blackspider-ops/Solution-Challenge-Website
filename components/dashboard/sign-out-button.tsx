"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    // Wait a moment for session to clear
    await new Promise(resolve => setTimeout(resolve, 100));
    // Force a hard reload to clear all client-side cache
    window.location.href = "/";
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </Button>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckInScanner } from "@/components/admin/checkin-scanner";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, QrCode } from "lucide-react";
import Link from "next/link";

export default async function VolunteerCheckInPage() {
  const session = await auth();
  if (!session || (session.user.role !== "volunteer" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" alt="GDG PSU" className="w-full h-full object-contain" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">Check-in Station</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {session.user.name ?? session.user.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Participant Check-in</h1>
          <p className="text-muted-foreground mt-1">
            Scan or enter the QR token from a participant&apos;s ticket.
          </p>
        </div>
        <CheckInScanner />
      </main>
    </div>
  );
}

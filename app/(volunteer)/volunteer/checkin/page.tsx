import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckInScanner } from "@/components/admin/checkin-scanner";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, QrCode, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function VolunteerCheckInPage() {
  const session = await auth();
  if (!session || (session.user.role !== "volunteer" && session.user.role !== "admin")) {
    redirect("/dashboard");
  }

  // Get recent check-ins
  const recentCheckIns = await db.checkIn.findMany({
    take: 10,
    orderBy: { checkedInAt: "desc" },
    include: {
      ticket: {
        include: {
          registration: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      performer: {
        select: {
          name: true,
        },
      },
    },
  });

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

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Participant Check-in</h1>
          <p className="text-muted-foreground mt-1">
            Scan the QR code from a participant&apos;s ticket.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div>
            <CheckInScanner />
          </div>

          {/* Recent Check-ins */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Recent Check-ins</h2>
            </div>

            {recentCheckIns.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <CheckCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No check-ins yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCheckIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {checkIn.ticket.registration.user.name || "Participant"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {checkIn.ticket.registration.user.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {checkIn.performer.name || "Volunteer"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(checkIn.checkedInAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

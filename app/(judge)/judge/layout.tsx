import { requireJudge } from "@/lib/judge-guard";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function JudgeLayout({ children }: { children: React.ReactNode }) {
  const session = await requireJudge();

  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "J";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/judge" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png"
                  alt="GDG PSU"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  Judge Panel
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Scale className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Judge</span>
                </div>
              </div>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{initials}</span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground">
                    {session.user?.name ?? "Judge"}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="icon">
                  <LogOut className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

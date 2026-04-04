import { requireAdmin } from "@/lib/admin-guard";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, ArrowLeft, Menu } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav-link";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
            <img src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" alt="GDG PSU" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              Admin Panel
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">Administrator</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="border-t border-border mb-3" />
        <AdminNav />
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-8 h-8 rounded-full shrink-0 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {session.user?.name ?? "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
          </div>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-4 px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center">
            <img src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" alt="GDG PSU" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shrink-0 sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

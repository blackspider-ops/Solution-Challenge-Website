"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Upload, QrCode, Megaphone, Shield, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",               label: "Overview",      icon: LayoutDashboard },
  { href: "/dashboard/team",          label: "Team",          icon: Users },
  { href: "/dashboard/submission",    label: "Submission",    icon: Upload },
  { href: "/dashboard/ticket",        label: "My Ticket",     icon: QrCode },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
];

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  badge?: number;
  highlight?: boolean;
}

function NavLinkItem({ href, icon: Icon, children, badge, highlight }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        highlight
          ? "bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-600 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20"
          : isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center",
          isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

/** Renders the full dashboard nav — owns navItems internally, no server→client prop passing */
export function DashboardNav({ announcementCount, userRole }: { announcementCount: number; userRole?: string }) {
  const isAdmin = userRole === "admin";
  const isVolunteer = userRole === "volunteer" || userRole === "admin";

  return (
    <>
      {navItems.map((item) => (
        <NavLinkItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          badge={item.href === "/dashboard/announcements" && announcementCount > 0
            ? announcementCount
            : undefined}
        >
          {item.label}
        </NavLinkItem>
      ))}
      
      {isVolunteer && (
        <>
          <div className="my-2 border-t border-border" />
          <Link
            href="/volunteer/checkin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20"
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span className="flex-1">Volunteer Panel</span>
          </Link>
        </>
      )}
      
      {isAdmin && (
        <>
          <div className="my-2 border-t border-border" />
          <NavLinkItem
            href="/admin"
            icon={Shield}
            highlight
          >
            Admin Panel
          </NavLinkItem>
        </>
      )}
    </>
  );
}

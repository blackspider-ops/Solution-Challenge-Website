"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, QrCode, Upload, Megaphone, Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin",               label: "Overview",      icon: LayoutDashboard },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/teams",         label: "Teams",         icon: Users },
  { href: "/admin/submissions",   label: "Submissions",   icon: Upload },
  { href: "/admin/tracks",        label: "Tracks",        icon: Layers },
  { href: "/admin/checkin",       label: "Check-in",      icon: QrCode },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

interface AdminNavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function AdminNavLinkItem({ href, icon: Icon, children }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {children}
    </Link>
  );
}

/** Renders the full admin nav — owns navItems internally */
export function AdminNav() {
  return (
    <>
      {adminNavItems.map((item) => (
        <AdminNavLinkItem key={item.href} href={item.href} icon={item.icon}>
          {item.label}
        </AdminNavLinkItem>
      ))}
    </>
  );
}

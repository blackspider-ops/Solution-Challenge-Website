"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const volunteerNavItems = [
  { href: "/volunteer/checkin", label: "Check-in", icon: QrCode },
  { href: "/volunteer/food", label: "Food Distribution", icon: UtensilsCrossed },
];

interface VolunteerNavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function VolunteerNavLinkItem({ href, icon: Icon, children }: VolunteerNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

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

export function VolunteerNav() {
  return (
    <>
      {volunteerNavItems.map((item) => (
        <VolunteerNavLinkItem key={item.href} href={item.href} icon={item.icon}>
          {item.label}
        </VolunteerNavLinkItem>
      ))}
    </>
  );
}

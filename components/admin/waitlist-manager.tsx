"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateEventSettings, promoteFromWaitlist } from "@/lib/actions/event-settings";
import { Users, CheckCircle, Clock, ArrowRight } from "lucide-react";

type WaitlistUser = {
  id: string;
  waitlistPosition: number | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

type Props = {
  maxCapacity: number;
  confirmedCount: number;
  waitlistedCount: number;
  waitlistUsers: WaitlistUser[];
  emailsEnabled: boolean;
  isSuperAdmin: boolean;
};

export function WaitlistManager({ maxCapacity: initialCapacity, confirmedCount, waitlistedCount, waitlistUsers, emailsEnabled: initialEmailsEnabled, isSuperAdmin }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [capacity, setCapacity] = useState(initialCapacity);
  const [emailsEnabled, setEmailsEnabled] = useState(initialEmailsEnabled);

  function handleUpdateCapacity() {
    if (capacity < confirmedCount) {
      toast.error(`Capacity cannot be less than current confirmed registrations (${confirmedCount})`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateEventSettings({
          maxCapacity: capacity,
          registrationOpen: true,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success("Capacity updated successfully");
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleToggleEmails() {
    if (!isSuperAdmin) {
      toast.error("Only the super admin can toggle email settings");
      return;
    }

    const newValue = !emailsEnabled;
    
    if (!confirm(`Are you sure you want to ${newValue ? "ENABLE" : "DISABLE"} all emails? ${!newValue ? "This will stop ALL email notifications system-wide!" : ""}`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateEventSettings({
          maxCapacity: capacity,
          registrationOpen: true,
          emailsEnabled: newValue,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setEmailsEnabled(newValue);
        toast.success(`Emails ${newValue ? "enabled" : "disabled"} successfully`);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handlePromote(registrationId: string, userName: string) {
    if (!confirm(`Promote ${userName} from waitlist to confirmed?`)) return;

    startTransition(async () => {
      try {
        const result = await promoteFromWaitlist(registrationId);

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(`${userName} has been promoted and will receive their ticket via email`);
        router.refresh();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  const spotsAvailable = capacity - confirmedCount;

  return (
    <div className="space-y-6">
      {/* Super Admin Email Control */}
      {isSuperAdmin && (
        <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="text-lg">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Super Admin Controls</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Master email kill switch - disables ALL email notifications system-wide (tickets, announcements, etc.)
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleEmails}
                  disabled={isPending}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailsEnabled ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailsEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${emailsEnabled ? "text-emerald-600" : "text-red-600"}`}>
                  Emails {emailsEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Status Warning for Regular Admins */}
      {!emailsEnabled && !isSuperAdmin && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Emails Disabled</p>
              <p className="text-xs text-red-600">
                All email notifications are currently disabled by the super admin. No emails will be sent until re-enabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Settings */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Event Capacity</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">Confirmed</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{confirmedCount}</p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">Waitlisted</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{waitlistedCount}</p>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Spots Available</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{spotsAvailable}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Maximum Capacity</Label>
            <div className="flex gap-2">
              <Input
                id="capacity"
                type="number"
                min={confirmedCount}
                max={10000}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                className="max-w-xs"
              />
              <Button
                onClick={handleUpdateCapacity}
                disabled={isPending || capacity === initialCapacity}
              >
                Update Capacity
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Current capacity: {initialCapacity} | Must be at least {confirmedCount} (current confirmed count)
            </p>
          </div>
        </div>
      </div>

      {/* Waitlist Queue */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Waitlist Queue</h2>

        {waitlistUsers.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No users on waitlist</p>
          </div>
        ) : (
          <div className="space-y-2">
            {waitlistUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-amber-600">#{user.waitlistPosition}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {user.user.name || "Participant"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{user.user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined waitlist: {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handlePromote(user.id, user.user.name || user.user.email)}
                  disabled={isPending || spotsAvailable <= 0}
                  size="sm"
                  className="gap-2 shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                  Promote
                </Button>
              </div>
            ))}
          </div>
        )}

        {spotsAvailable <= 0 && waitlistUsers.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-900">
              ⚠️ Event is at full capacity. Increase the maximum capacity above to promote users from the waitlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

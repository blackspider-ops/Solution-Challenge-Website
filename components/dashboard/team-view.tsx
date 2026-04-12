"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamSchema,
  joinTeamSchema,
  type CreateTeamInput,
  type JoinTeamInput,
} from "@/lib/schemas/team";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  removeMember,
  transferLeadership,
  updateTeamTrack,
} from "@/lib/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Users, Crown, LogOut, Copy, Check,
  Plus, UserPlus, UserMinus, RefreshCw, ChevronDown, DoorOpen,
} from "lucide-react";
import { RoomScanner } from "./room-scanner";

// ─── Inline types (no @prisma/client import in client components) ──────────
type Track = { id: string; name: string; icon: string; gradient: string };
type TeamMemberUser = { id: string; name: string | null; email: string; image: string | null };
type RoomBooking = { id: string; bookedAt: Date; room: { id: string; name: string; description: string | null } };
type TeamWithDetails = {
  id: string;
  name: string;
  leaderId: string;
  inviteCode: string;
  track: Track | null;
  leader: { id: string; name: string | null; email: string };
  members: { id: string; joinedAt: Date; user: TeamMemberUser }[];
  roomBookings?: RoomBooking[];
};

interface TeamViewProps {
  team: TeamWithDetails | null;
  tracks: Track[];
  currentUserId: string;
  hasRoomBooking?: boolean;
}

// ─── Avatar helper ─────────────────────────────────────────────────────────
function Avatar({ user }: { user: TeamMemberUser }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.name ?? user.email}
        className="w-9 h-9 rounded-full shrink-0 object-cover"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-primary">
        {(user.name ?? user.email)[0].toUpperCase()}
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function TeamView({ team, tracks, currentUserId, hasRoomBooking }: TeamViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [copied, setCopied] = useState(false);
  const [showLeaderActions, setShowLeaderActions] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showTrackEdit, setShowTrackEdit] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(team?.track?.id ?? "");
  
  // Dialog states
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const createForm = useForm<CreateTeamInput>({ resolver: zodResolver(createTeamSchema) });
  const joinForm = useForm<JoinTeamInput>({ resolver: zodResolver(joinTeamSchema) });

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
      } catch {
        toast.error("Network error — please try again");
      }
    });
  }

  function handleCreate(data: CreateTeamInput) {
    run(async () => {
      const result = await createTeam(data);
      if ("error" in result) { toast.error(result.error); return; }
      toast.success(`Team created! Invite code: ${result.data.inviteCode}`);
      router.refresh();
    });
  }

  function handleJoin(data: JoinTeamInput) {
    run(async () => {
      const result = await joinTeam(data);
      if ("error" in result) { toast.error(result.error); return; }
      toast.success("Joined team!");
      router.refresh();
    });
  }

  function handleLeave() {
    setShowLeaveDialog(true);
  }

  function confirmLeave() {
    setShowLeaveDialog(false);
    run(async () => {
      const result = await leaveTeam();
      if ("error" in result) { toast.error(result.error); return; }
      toast.success("You left the team");
      router.refresh();
    });
  }

  function handleRemoveMember(userId: string, name: string) {
    setMemberToRemove({ id: userId, name });
    setShowRemoveDialog(true);
  }

  function confirmRemove() {
    if (!memberToRemove) return;
    setShowRemoveDialog(false);
    run(async () => {
      const result = await removeMember(memberToRemove.id);
      if ("error" in result) { toast.error(result.error); return; }
      toast.success(`${memberToRemove.name} removed from team`);
      setMemberToRemove(null);
      router.refresh();
    });
  }

  function handleTransferLeadership() {
    if (!transferTarget) { toast.error("Select a member first"); return; }
    setShowTransferDialog(true);
  }

  function confirmTransfer() {
    setShowTransferDialog(false);
    run(async () => {
      const result = await transferLeadership({ newLeaderId: transferTarget });
      if ("error" in result) { toast.error(result.error); return; }
      toast.success("Leadership transferred");
      setShowTransfer(false);
      router.refresh();
    });
  }

  function handleUpdateTrack() {
    if (!selectedTrack) { toast.error("Select a track first"); return; }
    run(async () => {
      const result = await updateTeamTrack({ trackId: selectedTrack });
      if ("error" in result) { toast.error(result.error); return; }
      toast.success("Track updated");
      setShowTrackEdit(false);
      router.refresh();
    });
  }

  function copyInviteCode() {
    if (!team) return;
    navigator.clipboard.writeText(team.inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Has a team ────────────────────────────────────────────────────────
  if (team) {
    const isLeader = team.leaderId === currentUserId;
    const otherMembers = team.members.filter((m) => m.user.id !== currentUserId);

    return (
      <>
        <div className="space-y-4">
        {/* Team card */}
        <div className="rounded-2xl border border-border bg-card p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">{team.name}</h2>
                {isLeader && (
                  <Badge variant="secondary" className="gap-1 shrink-0">
                    <Crown className="w-3 h-3 text-amber-500" /> Leader
                  </Badge>
                )}
              </div>

              {/* Track display / edit */}
              {!showTrackEdit ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Track:{" "}
                    <span className="font-medium text-foreground">
                      {team.track?.name ?? "Not selected"}
                    </span>
                  </p>
                  {isLeader && (
                    <button
                      onClick={() => { setShowTrackEdit(true); setSelectedTrack(team.track?.id ?? ""); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="">Select track...</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <Button size="sm" onClick={handleUpdateTrack} disabled={isPending} className="h-8 text-xs">
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowTrackEdit(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Leave button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeave}
              disabled={isPending}
              className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5 shrink-0 ml-3"
            >
              <LogOut className="w-3.5 h-3.5" />
              Leave
            </Button>
          </div>

          {/* Members list */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Members ({team.members.length}/4)
            </p>

            {team.members.map(({ id, user }) => {
              const isMemberLeader = user.id === team.leaderId;
              const isMe = user.id === currentUserId;

              return (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group"
                >
                  <Avatar user={user} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name ?? user.email}
                      </p>
                      {isMe && (
                        <span className="text-xs text-muted-foreground">(you)</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isMemberLeader && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                    {/* Leader can remove non-leader members */}
                    {isLeader && !isMe && !isMemberLeader && (
                      <button
                        onClick={() => handleRemoveMember(user.id, user.name ?? user.email)}
                        disabled={isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Remove member"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: 4 - team.members.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border"
              >
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Open slot</p>
              </div>
            ))}
          </div>

          {/* Invite code */}
          {team.members.length < 4 && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
              <p className="text-xs font-medium text-foreground mb-2">
                Invite teammates — share this code:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono font-bold tracking-widest bg-background border border-border rounded-lg px-4 py-2 text-foreground text-center">
                  {team.inviteCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInviteCode}
                  className="shrink-0 gap-1.5"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy</>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Teammates can also use the full team ID: <span className="font-mono">{team.id}</span>
              </p>
            </div>
          )}

          {/* Hacking Space */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 mb-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Hacking Space</p>
              </div>
              {hasRoomBooking && team.roomBookings && team.roomBookings.length > 0 && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                  <Check className="w-3 h-3 mr-1" />
                  Booked
                </Badge>
              )}
            </div>

            {hasRoomBooking && team.roomBookings && team.roomBookings.length > 0 ? (
              <div className="space-y-2">
                {team.roomBookings.map((booking) => (
                  <div key={booking.id} className="bg-background/50 rounded-lg p-3 border border-border">
                    <p className="font-medium text-sm">{booking.room.name}</p>
                    {booking.room.description && (
                      <p className="text-xs text-muted-foreground mt-1">{booking.room.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Scan a hacking space QR code to reserve your team's workspace
                </p>
                <RoomScanner />
              </div>
            )}
          </div>

          {/* Leader actions */}
          {isLeader && otherMembers.length > 0 && (
            <div className="border-t border-border pt-4">
              <button
                onClick={() => setShowLeaderActions(!showLeaderActions)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Transfer leadership
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLeaderActions ? "rotate-180" : ""}`} />
              </button>

              {showLeaderActions && (
                <div className="mt-3 space-y-2">
                  {!showTransfer ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTransfer(true)}
                      className="text-xs"
                    >
                      Transfer leadership to another member
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={transferTarget}
                        onChange={(e) => setTransferTarget(e.target.value)}
                        className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="">Select new leader...</option>
                        {otherMembers.map(({ user }) => (
                          <option key={user.id} value={user.id}>
                            {user.name ?? user.email}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        onClick={handleTransferLeadership}
                        disabled={isPending || !transferTarget}
                        className="h-8 text-xs"
                      >
                        Transfer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowTransfer(false); setTransferTarget(""); }}
                        className="h-8 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leave Team Dialog */}
        <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Team?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this team? You'll need a new invite code to rejoin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLeave}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Leave Team
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Remove Member Dialog */}
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from the team? 
                They'll need a new invite code to rejoin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMemberToRemove(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemove}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Transfer Leadership Dialog */}
        <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Transfer Leadership?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to transfer leadership? You will become a regular team member and 
                will no longer have leader privileges.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmTransfer}>
                Transfer Leadership
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </>
    );
  }

  // ── No team ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {mode === "idle" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMode("create")}
              className="group p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-card hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Create a team</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a new team and invite up to 3 others
              </p>
            </button>

            <button
              onClick={() => setMode("join")}
              className="group p-6 rounded-2xl border-2 border-dashed border-border hover:border-blue-500/40 bg-card hover:bg-blue-500/5 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="font-semibold text-foreground">Join a team</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter an invite code or team ID
              </p>
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Teams can have up to 4 members · You can only be on one team at a time
          </p>
        </>
      )}

      {mode === "create" && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Create a team</h2>
          </div>

          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Team name</Label>
              <Input
                id="name"
                {...createForm.register("name")}
                placeholder="Awesome Hackers"
                autoFocus
                disabled={isPending}
              />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="trackId">Challenge track</Label>
              <select
                id="trackId"
                {...createForm.register("trackId")}
                disabled={isPending}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              >
                <option value="">Select a track...</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {createForm.formState.errors.trackId && (
                <p className="text-xs text-destructive">{createForm.formState.errors.trackId.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
              >
                {isPending ? "Creating..." : "Create team"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setMode("idle"); createForm.reset(); }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {mode === "join" && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Join a team</h2>
          </div>

          <form onSubmit={joinForm.handleSubmit(handleJoin)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">Invite code or team ID</Label>
              <Input
                id="code"
                {...joinForm.register("code")}
                placeholder="e.g. ABC123"
                className="font-mono uppercase"
                autoFocus
                disabled={isPending}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  joinForm.setValue("code", e.target.value);
                }}
              />
              {joinForm.formState.errors.code && (
                <p className="text-xs text-destructive">{joinForm.formState.errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter the 6-character invite code or the full team ID shared by your team leader.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
              >
                {isPending ? "Joining..." : "Join team"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setMode("idle"); joinForm.reset(); }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

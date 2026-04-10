import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SubmissionForm } from "@/components/dashboard/submission-form";
import { Upload, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SubmissionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.teamMember.findUnique({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          track: { select: { id: true, name: true } },
          submission: {
            select: {
              id: true,
              title: true,
              description: true,
              repoUrl: true,
              demoUrl: true,
              videoUrl: true,
              status: true,
              updatedAt: true,
            },
          },
          roomBookings: {
            include: {
              room: { select: { name: true } },
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  registration: {
                    select: {
                      ticket: {
                        select: {
                          checkIn: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
              registration: {
                select: {
                  ticket: {
                    select: {
                      checkIn: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const team = membership?.team ?? null;
  const hasRoomBooking = (team?.roomBookings?.length ?? 0) > 0;

  // Check if all team members are checked in
  let allCheckedIn = false;
  let notCheckedInMembers: string[] = [];

  if (team) {
    const allMembers = [
      { 
        name: team.leader.name || team.leader.email, 
        checkedIn: !!team.leader.registration?.ticket?.checkIn 
      },
      ...team.members.map(m => ({
        name: m.user.name || m.user.email,
        checkedIn: !!m.user.registration?.ticket?.checkIn
      }))
    ];

    notCheckedInMembers = allMembers.filter(m => !m.checkedIn).map(m => m.name);
    allCheckedIn = notCheckedInMembers.length === 0;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Submission</h1>
          <p className="text-sm text-muted-foreground">
            {team?.submission
              ? `Status: ${team.submission.status}`
              : "One submission per team"}
          </p>
        </div>
      </div>

      {/* No team */}
      {!membership && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Create a Team First</h2>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            You need to create or join a team before submitting a project.
          </p>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            <strong>Working solo?</strong> No problem! Create a team with just yourself as the only member.
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <Link href="/dashboard/team">Create or Join Team</Link>
          </Button>
        </div>
      )}

      {/* Has team but no room booking */}
      {membership && !hasRoomBooking && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-700">Hacking space required</p>
            <p className="text-xs text-amber-600 mt-1">
              Your team must scan a hacking space QR code before submitting. Visit the{" "}
              <Link href="/dashboard/team" className="underline font-medium">
                Team page
              </Link>{" "}
              to book your workspace.
            </p>
          </div>
        </div>
      )}

      {/* Has team but not all members checked in */}
      {membership && !allCheckedIn && notCheckedInMembers.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Team members must check in</p>
            <p className="text-xs text-red-600 mt-1">
              All team members must be checked in at the event entrance before submitting.
            </p>
            <p className="text-xs text-red-600 mt-2 font-medium">
              Not checked in: {notCheckedInMembers.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Has team but no track */}
      {membership && !team?.track && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700">No challenge track selected</p>
            <p className="text-xs text-amber-600 mt-1">
              Your team leader needs to select a challenge track on the{" "}
              <Link href="/dashboard/team" className="underline font-medium">
                Team page
              </Link>{" "}
              before you can submit.
            </p>
          </div>
        </div>
      )}

      {/* Submission form — show even without track so user can draft */}
      {membership && (
        <SubmissionForm
          existing={team?.submission ?? null}
          trackName={team?.track?.name ?? null}
          hasRoomBooking={hasRoomBooking}
          allMembersCheckedIn={allCheckedIn}
        />
      )}
    </div>
  );
}

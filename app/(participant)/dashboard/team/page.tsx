import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TeamView } from "@/components/dashboard/team-view";
import { Users } from "lucide-react";

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [membership, tracks] = await Promise.all([
    db.teamMember.findUnique({
      where: { userId: session.user.id },
      include: {
        team: {
          include: {
            track: { select: { id: true, name: true, icon: true, gradient: true } },
            leader: { select: { id: true, name: true, email: true } },
            members: {
              orderBy: { joinedAt: "asc" },
              include: {
                user: { select: { id: true, name: true, email: true, image: true } },
              },
            },
          },
        },
      },
    }),
    db.track.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, icon: true, gradient: true },
    }),
  ]);

  const team = membership?.team ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground text-sm">
            {team
              ? `${team.members.length}/4 members · ${team.track?.name ?? "No track selected"}`
              : "Create or join a team of up to 4 members"}
          </p>
        </div>
      </div>

      <TeamView
        team={team}
        tracks={tracks}
        currentUserId={session.user.id}
      />
    </div>
  );
}

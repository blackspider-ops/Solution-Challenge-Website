import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { Users } from "lucide-react";

type TeamRow = {
  id: string;
  name: string;
  inviteCode: string;
  track: { name: string } | null;
  leader: { name: string | null; email: string };
  members: { user: { name: string | null; email: string; image: string | null } }[];
  _count: { members: number };
};

export default async function TeamsPage() {
  await requireAdmin();
  const teams = await db.team.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      track: { select: { name: true } },
      leader: { select: { name: true, email: true } },
      members: {
        include: { user: { select: { name: true, email: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      },
      _count: { select: { members: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Teams</h1>
        <p className="text-muted-foreground mt-1">{teams.length} teams formed</p>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No teams formed yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team: TeamRow) => (
            <div key={team.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {team.inviteCode}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track: <span className="text-foreground">{team.track?.name ?? "Not selected"}</span>
                  </p>
                </div>
                <span className="text-sm text-muted-foreground shrink-0">
                  {team._count.members}/4 members
                </span>
              </div>

              {/* Members */}
              <div className="flex flex-wrap gap-2">
                {team.members.map(({ user }) => (
                  <div
                    key={user.email}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 text-sm"
                  >
                    {user.image ? (
                      <img src={user.image} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-foreground">{user.name ?? user.email}</span>
                    {user.email === team.leader.email && (
                      <span className="text-amber-500 text-xs">★</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

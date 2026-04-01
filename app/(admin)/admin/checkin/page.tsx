import { CheckInScanner } from "@/components/admin/checkin-scanner";
import { getCheckInStats, getRecentCheckIns } from "@/lib/actions/checkin";
import { CheckCircle, Clock, Users } from "lucide-react";

export default async function CheckInPage() {
  const [stats, recent] = await Promise.all([
    getCheckInStats(),
    getRecentCheckIns(),
  ]);

  const pct = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Check-in</h1>
        <p className="text-muted-foreground mt-1">
          Scan participant QR codes to check them in at the event entrance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Total tickets</p>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.checkedIn}</p>
          <p className="text-xs text-muted-foreground mt-1">Checked in ({pct}%)</p>
        </div>
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.remaining}</p>
          <p className="text-xs text-muted-foreground mt-1">Not yet arrived</p>
        </div>
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Check-in progress</p>
            <p className="text-sm text-muted-foreground">{pct}%</p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Scanner */}
      <CheckInScanner />

      {/* Recent check-ins */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent check-ins</h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Participant</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Checked in at</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((ci: {
                  id: string;
                  checkedInAt: Date;
                  ticket: { registration: { user: { name: string | null; email: string; image: string | null } } };
                  performer: { name: string | null; email: string };
                }) => {
                  const user = ci.ticket.registration.user;
                  return (
                    <tr key={ci.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-emerald-600">
                                {(user.name ?? user.email)[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{user.name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(ci.checkedInAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {ci.performer.name ?? ci.performer.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

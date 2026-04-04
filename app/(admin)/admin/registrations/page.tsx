import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users } from "lucide-react";
import { RegistrationsSearch } from "@/components/admin/registrations-search";
import { formatLocalTime } from "@/lib/format-date";

type SearchParams = { q?: string; status?: string; checkin?: string };

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const query   = params.q?.trim() ?? "";
  const status  = params.status ?? "all";
  const checkin = params.checkin ?? "all";

  // Build Prisma where clause from filters
  const where = {
    ...(status !== "all" && { status: status as "pending" | "confirmed" | "waitlisted" }),
    ...(checkin === "yes" && { ticket: { checkIn: { isNot: null } } }),
    ...(checkin === "no"  && { ticket: { checkIn: { is: null } } }),
    ...(query && {
      user: {
        OR: [
          { name:  { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      },
    }),
  };

  const [registrations, total] = await Promise.all([
    db.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, image: true } },
        ticket: { include: { checkIn: true } },
      },
    }),
    db.registration.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registrations</h1>
          <p className="text-muted-foreground mt-1">
            {registrations.length} shown · {total} total
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <RegistrationsSearch defaultQuery={query} defaultStatus={status} defaultCheckin={checkin} />

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Participant</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ticket</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Check-in</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {reg.user.image ? (
                      <img src={reg.user.image} alt="" className="w-7 h-7 rounded-full shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-blue-500">
                          {(reg.user.name ?? reg.user.email)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{reg.user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">{reg.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={reg.status === "confirmed" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {reg.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {reg.ticket ? (
                    <span className="text-xs font-mono text-muted-foreground">
                      {reg.ticket.qrToken.slice(0, 8)}…
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {reg.ticket?.checkIn ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {formatLocalTime(reg.ticket.checkIn.checkedInAt)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(reg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {registrations.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {query || status !== "all" || checkin !== "all"
                ? "No registrations match your filters."
                : "No registrations yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

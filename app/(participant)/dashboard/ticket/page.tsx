import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { QRTicket } from "@/components/dashboard/qr-ticket";

export default async function TicketPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const registration = await db.registration.findUnique({
    where: { userId: session.user.id },
    include: { ticket: { include: { checkIn: true } } },
  });

  if (!registration || !registration.ticket) redirect("/dashboard");

  const { ticket } = registration;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Ticket</h1>
        <p className="text-muted-foreground mt-1">Show this QR code at the event entrance.</p>
      </div>

      {/* Email notification */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-700 mb-1">
              📧 Ticket Emailed
            </p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Your ticket has been sent to <span className="font-medium">{session.user.email}</span> from{" "}
              <span className="font-medium">Solution Challenge &lt;noreply@gdgpsu.dev&gt;</span>.
              {" "}Please check your spam/junk folder if you don't see it in your inbox.
            </p>
          </div>
        </div>
      </div>

      <QRTicket
        qrToken={ticket.qrToken}
        name={session.user.name ?? "Participant"}
        email={session.user.email ?? ""}
        status={registration.status}
        checkedIn={!!ticket.checkIn}
        checkedInAt={ticket.checkIn?.checkedInAt ?? null}
      />
    </div>
  );
}

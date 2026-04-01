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

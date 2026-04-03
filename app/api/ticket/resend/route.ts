import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendTicketEmail } from "@/lib/email";

/**
 * Resend ticket email to user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    // Verify email matches session user
    if (email !== session.user.email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 });
    }

    // Get user's ticket
    const registration = await db.registration.findUnique({
      where: { userId: session.user.id },
      include: { ticket: true },
    });

    if (!registration?.ticket) {
      return NextResponse.json({ error: "No ticket found" }, { status: 404 });
    }

    // Send email with ticket
    const result = await sendTicketEmail(
      email,
      session.user.name || "Participant",
      registration.ticket.qrToken
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket sent to your email",
    });
  } catch (error) {
    console.error("Resend ticket error:", error);
    return NextResponse.json(
      { error: "Failed to resend ticket" },
      { status: 500 }
    );
  }
}

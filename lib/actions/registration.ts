"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendTicketEmail } from "@/lib/email";
import { getEventSettings } from "./event-settings";

/**
 * Send waitlist email
 */
async function sendWaitlistEmail(email: string, name: string, position: number) {
  // Check if emails are globally enabled
  try {
    const { db } = await import("@/lib/db");
    const settings = await db.eventSettings.findUnique({
      where: { id: "singleton" },
      select: { emailsEnabled: true },
    });
    if (!settings?.emailsEnabled) {
      console.log("Emails are disabled by super admin - skipping waitlist email");
      return { success: false };
    }
  } catch (error) {
    console.error("Error checking email settings:", error);
  }

  const { Resend } = await import("resend");
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  
  if (!resend) return { success: false };

  const FROM_EMAIL = process.env.EMAIL_FROM || "Solution Challenge <noreply@gdgpsu.dev>";
  
  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };
  
  const safeName = escapeHtml(name);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're on the Waitlist - Solution Challenge 2026",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <img src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" alt="GDG PSU" style="width: 60px; height: 60px; margin-bottom: 20px;" />
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">You're on the Waitlist!</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; font-size: 18px; color: #111827; font-weight: 600;">Hi ${safeName},</p>
                        
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                          Thank you for your interest in Solution Challenge 2026! The event has reached full capacity, but you've been added to our waitlist.
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #92400e;">📋 Your Waitlist Position</p>
                              <p style="margin: 0; font-size: 32px; font-weight: bold; color: #92400e;">#${position}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #dbeafe; border-radius: 8px;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1e40af;">What happens next?</p>
                          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e3a8a; line-height: 1.8;">
                            <li>If a spot opens up, we'll email you immediately</li>
                            <li>You'll receive your QR code ticket via email</li>
                            <li>Keep an eye on your inbox for updates</li>
                          </ul>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                          We'll keep you updated on your status. Thank you for your patience!<br><br>
                          <strong>Google Developer Groups at Penn State</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                          <strong>Google Developer Groups at Penn State</strong>
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          <a href="mailto:gdg@psu.edu" style="color: #9ca3af; text-decoration: none;">gdg@psu.edu</a>
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Send waitlist email error:", error);
    return { success: false };
  }
}

/**
 * Register the current user for the event.
 * Creates a Registration (confirmed or waitlisted based on capacity) and issues a Ticket if confirmed.
 * Also sends email with QR code ticket or waitlist notification.
 */
export async function registerForEvent(): Promise<
  { error: string } | { data: { id: string; status: "confirmed" | "waitlisted"; ticketId?: string; qrToken?: string; waitlistPosition?: number } }
> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await db.registration.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) return { error: "You are already registered" };

  try {
    // Get event settings
    const settings = await getEventSettings();

    // Use transaction to prevent race conditions
    const result = await db.$transaction(async (tx) => {
      // Check capacity inside transaction for consistency
      const confirmedCount = await tx.registration.count({ where: { status: "confirmed" } });
      const isAtCapacity = confirmedCount >= settings.maxCapacity;

      if (isAtCapacity) {
        // Add to waitlist
        const waitlistedCount = await tx.registration.count({ where: { status: "waitlisted" } });
        const waitlistPosition = waitlistedCount + 1;

        const registration = await tx.registration.create({
          data: { 
            userId: session.user.id, 
            status: "waitlisted",
            waitlistPosition,
          },
        });

        return { registration, ticket: null, isWaitlisted: true, waitlistPosition };
      }

      // Event has capacity - confirm registration
      const registration = await tx.registration.create({
        data: { userId: session.user.id, status: "confirmed" },
      });
      const ticket = await tx.ticket.create({
        data: { registrationId: registration.id },
      });
      
      return { registration, ticket, isWaitlisted: false };
    });

    // Handle waitlist case
    if (result.isWaitlisted) {
      // Send waitlist email
      await sendWaitlistEmail(
        session.user.email!,
        session.user.name || "Participant",
        result.waitlistPosition!
      );

      revalidatePath("/dashboard");

      return {
        data: {
          id: result.registration.id,
          status: "waitlisted" as const,
          waitlistPosition: result.waitlistPosition,
        },
      };
    }

    // Handle confirmed registration case
    // Send email with ticket
    const emailResult = await sendTicketEmail(
      session.user.email!,
      session.user.name || "Participant",
      result.ticket!.qrToken
    );

    if (!emailResult.success) {
      console.error("Failed to send ticket email:", emailResult.error);
      // Don't fail registration if email fails
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/ticket");

    return {
      data: {
        id: result.registration.id,
        status: "confirmed" as const,
        ticketId: result.ticket!.id,
        qrToken: result.ticket!.qrToken,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register. Please try again." };
  }
}

/**
 * Get the current user's registration with their ticket.
 */
export async function getMyRegistration() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.registration.findUnique({
    where: { userId: session.user.id },
    include: { ticket: { include: { checkIn: true } } },
  });
}

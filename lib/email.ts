import { Resend } from "resend";

// Make Resend optional - only initialize if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "Solution Challenge <noreply@yourdomain.com>";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Generate QR code ticket email HTML
 */
function generateTicketEmailHTML(name: string, email: string, qrToken: string): string {
  const qrImageUrl = `${BASE_URL}/api/qr/${qrToken}`;
  const ticketUrl = `${BASE_URL}/dashboard/ticket`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Solution Challenge Ticket</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Solution Challenge 2026</h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your Event Ticket</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; font-size: 18px; color: #111827; font-weight: 600;">Hi ${name},</p>
                    
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
                      You're all set for Solution Challenge 2026! Here's your QR code ticket. Save this email or screenshot the QR code below.
                    </p>
                    
                    <!-- QR Code -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 30px; border-radius: 12px;">
                          <img src="${qrImageUrl}" alt="QR Code Ticket" width="240" height="240" style="display: block; border: 3px solid #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                          <p style="margin: 15px 0 0 0; font-family: 'Courier New', monospace; font-size: 12px; color: #6b7280; word-break: break-all;">${qrToken}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Event Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1e40af;">📅 Event Details</p>
                          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.8;">
                            <strong>Date:</strong> April 11-12, 2026<br>
                            <strong>Time:</strong> April 11, 7:00 PM – April 12, 12:00 PM (Noon)<br>
                            <strong>Location:</strong> <a href="https://www.google.com/maps?q=40.79299139676293,-77.87067405918272" style="color: #1e3a8a; text-decoration: underline;">ECoRE Building, University Park, PA</a><br>
                            <strong>Organizer:</strong> Google Developer Groups at Penn State
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Instructions -->
                    <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #86efac;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #166534;">✓ What to do next:</p>
                      <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #166534; line-height: 1.8;">
                        <li>Print this ticket or save the QR code to your device</li>
                        <li>Show it at the event entrance on April 11</li>
                        <li>Keep this email for reference</li>
                      </ol>
                    </div>
                    
                    <!-- RSVP Reminder -->
                    <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border: 1px solid #fbbf24;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #92400e;">⚠️ Important: RSVP Required</p>
                      <p style="margin: 0 0 15px 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                        Please also RSVP on the official GDG website to confirm your attendance:
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://gdg.community.dev/events/details/google-gdg-on-campus-pennsylvania-state-university-state-college-united-states-presents-gdg-penn-state-solution-challenge-hackathon-innovate-for-impact/" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">RSVP on GDG Website</a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${ticketUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">View Ticket Online</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                      See you at the event!<br>
                      <strong>Google Developer Groups at Penn State</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                      <strong>Google Developer Groups at Penn State</strong>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      <a href="mailto:gdg@psu.edu" style="color: #9ca3af; text-decoration: none;">gdg@psu.edu</a>
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
                      This ticket is non-transferable and valid only for ${email}
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Send ticket email to participant
 */
export async function sendTicketEmail(
  email: string,
  name: string,
  qrToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - skipping email");
      return { success: false, error: "Email service not configured" };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Solution Challenge 2026 Ticket 🎫",
      html: generateTicketEmailHTML(name, email, qrToken),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("Ticket email sent:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Send ticket email error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send announcement email to all participants
 */
export async function sendAnnouncementEmail(
  emails: string[],
  title: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - skipping email");
      return { success: false, error: "Email service not configured" };
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${title}</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="font-size: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${body}</div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
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
    `;

    // Send to all emails (Resend supports batch sending)
    const { data, error } = await resend.batch.send(
      emails.map((email) => ({
        from: FROM_EMAIL,
        to: email,
        subject: `[Solution Challenge] ${title}`,
        html: htmlBody,
      }))
    );

    if (error) {
      console.error("Resend batch error:", error);
      return { success: false, error: error.message };
    }

    console.log(`Announcement sent to ${emails.length} recipients`);
    return { success: true };
  } catch (error) {
    console.error("Send announcement email error:", error);
    return { success: false, error: "Failed to send emails" };
  }
}

/**
 * Send form submission notification to admin
 */
export async function sendFormSubmissionNotification(
  userName: string,
  userEmail: string,
  submittedAt: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - skipping email");
      return { success: false, error: "Email service not configured" };
    }

    const adminEmail = "gdg@psu.edu";
    const dashboardUrl = `${BASE_URL}/admin/registration-form`;

    const htmlBody = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Registration Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">📝 New Registration Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">
                        A new registration form has been submitted.
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f9fafb; border-radius: 8px;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;"><strong>Participant:</strong></p>
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #111827;">${userName}</p>
                            
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;"><strong>Email:</strong></p>
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #111827;">${userEmail}</p>
                            
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;"><strong>Submitted:</strong></p>
                            <p style="margin: 0; font-size: 16px; color: #111827;">${submittedAt.toLocaleString()}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">View in Admin Dashboard</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                        Solution Challenge 2026 - Admin Notification
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New Registration: ${userName}`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("Form submission notification sent:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Send form notification error:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificateSchema, sendCertificateSchema, type CertificateInput, type SendCertificateInput } from "@/lib/schemas/certificate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to convert HTML to PDF using Puppeteer
async function htmlToPdf(html: string): Promise<Buffer> {
  let browser;
  try {
    // Dynamically import puppeteer based on environment
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      const puppeteer = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');
      
      browser = await puppeteer.default.launch({
        args: [...chromium.default.args, '--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    
    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
    throw error;
  }
}

// ─── Create Certificate Template ────────────────────────────────────────────

export async function createCertificate(input: unknown): Promise<{ error: string } | { data: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    const certificate = await db.certificate.create({
      data: {
        ...parsed.data,
        createdBy: session.user.id,
      },
    });

    return { data: { id: certificate.id } };
  } catch {
    return { error: "Failed to create certificate template" };
  }
}

// ─── Update Certificate Template ────────────────────────────────────────────

export async function updateCertificate(
  id: string,
  input: unknown
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    await db.certificate.update({
      where: { id },
      data: parsed.data,
    });

    return { data: true };
  } catch {
    return { error: "Failed to update certificate template" };
  }
}

// ─── Delete Certificate Template ────────────────────────────────────────────

export async function deleteCertificate(id: string): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  try {
    await db.certificate.delete({ where: { id } });
    return { data: true };
  } catch {
    return { error: "Failed to delete certificate template" };
  }
}

// ─── Send Certificates ──────────────────────────────────────────────────────

export async function sendCertificates(
  input: unknown
): Promise<{ error: string } | { data: { sent: number } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const parsed = sendCertificateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { certificateId, audience, teamId, userIds } = parsed.data;

  try {
    // Get certificate template
    const certificate = await db.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) return { error: "Certificate template not found" };

    // Determine recipients
    let recipients: Array<{ userId: string; userName: string; userEmail: string; teamName?: string; trackName?: string }> = [];

    if (audience === "individual" && userIds && userIds.length > 0) {
      // Individual users
      const users = await db.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
          teamMemberships: {
            include: {
              team: {
                include: {
                  track: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      recipients = users.map((u) => ({
        userId: u.id,
        userName: u.name || u.email,
        userEmail: u.email,
        teamName: u.teamMemberships[0]?.team.name,
        trackName: u.teamMemberships[0]?.team.track?.name,
      }));
    } else if (audience === "team" && teamId) {
      // Specific team
      const team = await db.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          leader: { select: { id: true, name: true, email: true } },
          track: { select: { name: true } },
        },
      });

      if (!team) return { error: "Team not found" };

      // Include all team members (leader is in members array)
      recipients = team.members.map((m) => ({
        userId: m.user.id,
        userName: m.user.name || m.user.email,
        userEmail: m.user.email,
        teamName: team.name,
        trackName: team.track?.name,
      }));
    } else if (audience === "registered") {
      // All registered participants
      const registrations = await db.registration.findMany({
        where: { status: "confirmed" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              teamMemberships: {
                include: {
                  team: {
                    include: {
                      track: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      recipients = registrations.map((r) => ({
        userId: r.user.id,
        userName: r.user.name || r.user.email,
        userEmail: r.user.email,
        teamName: r.user.teamMemberships[0]?.team.name,
        trackName: r.user.teamMemberships[0]?.team.track?.name,
      }));
    } else if (audience === "checked_in") {
      // Only checked-in participants
      const checkedIn = await db.registration.findMany({
        where: {
          status: "confirmed",
          ticket: {
            checkIn: {
              isNot: null,
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              teamMemberships: {
                include: {
                  team: {
                    include: {
                      track: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      recipients = checkedIn.map((r) => ({
        userId: r.user.id,
        userName: r.user.name || r.user.email,
        userEmail: r.user.email,
        teamName: r.user.teamMemberships[0]?.team.name,
        trackName: r.user.teamMemberships[0]?.team.track?.name,
      }));
    } else if (audience === "volunteers") {
      // All volunteers
      const volunteers = await db.user.findMany({
        where: { role: "volunteer" },
        select: { id: true, name: true, email: true },
      });

      recipients = volunteers.map((v) => ({
        userId: v.id,
        userName: v.name || v.email,
        userEmail: v.email,
      }));
    } else if (audience === "admins") {
      // All admins
      const admins = await db.user.findMany({
        where: { role: "admin" },
        select: { id: true, name: true, email: true },
      });

      recipients = admins.map((a) => ({
        userId: a.id,
        userName: a.name || a.email,
        userEmail: a.email,
      }));
    } else if (audience === "all") {
      // Everyone
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          teamMemberships: {
            include: {
              team: {
                include: {
                  track: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      recipients = users.map((u) => ({
        userId: u.id,
        userName: u.name || u.email,
        userEmail: u.email,
        teamName: u.teamMemberships[0]?.team.name,
        trackName: u.teamMemberships[0]?.team.track?.name,
      }));
    }

    if (recipients.length === 0) {
      return { error: "No recipients found" };
    }

    // Filter out already sent (except for Tejas - allow unlimited resends for testing)
    const alreadySent = await db.certificateSent.findMany({
      where: {
        certificateId,
        userId: { in: recipients.map((r) => r.userId) },
      },
      select: { userId: true },
    });

    const alreadySentSet = new Set(alreadySent.map((s: { userId: string }) => s.userId));
    const toSend = recipients.filter((r) => {
      // Allow Tejas to receive certificates multiple times for testing
      if (r.userName.toLowerCase().includes('tejas')) {
        return true;
      }
      return !alreadySentSet.has(r.userId);
    });

    if (toSend.length === 0) {
      return { error: "All recipients have already received this certificate" };
    }

    // Send emails
    let sent = 0;
    for (const recipient of toSend) {
      try {
        // Replace placeholders in HTML certificate
        let certificateHtml = certificate.htmlContent
          .replace(/\{\{name\}\}/g, recipient.userName)
          .replace(/\{\{team\}\}/g, recipient.teamName || "N/A")
          .replace(/\{\{track\}\}/g, recipient.trackName || "N/A")
          .replace(/\{\{signature\}\}/g, "");

        // Generate PDF from HTML
        const pdfBuffer = await htmlToPdf(certificateHtml);
        const filename = `${certificate.name.replace(/\s+/g, '_')}_${recipient.userName.replace(/\s+/g, '_')}.pdf`;

        // Create nice email body
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #C5221F; }
    .logo { font-size: 32px; font-weight: bold; background: linear-gradient(90deg, #C5221F, #E37400, #F4B400, #0F9D58); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .content { padding: 30px 0; }
    h1 { color: #202124; font-size: 24px; margin-bottom: 20px; }
    p { color: #5f6368; margin-bottom: 15px; }
    .highlight { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e8eaed; color: #80868b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">GOOGLE developers</div>
  </div>
  
  <div class="content">
    <h1>🎉 Congratulations, ${recipient.userName}!</h1>
    
    <p>We're thrilled to present you with your <strong>${certificate.name}</strong> for participating in the GDG @ Penn State Solution Challenge 2026!</p>
    
    <div class="highlight">
      <p style="margin: 0;"><strong>📋 Your Details:</strong></p>
      <p style="margin: 5px 0 0 0;">Team: ${recipient.teamName || "N/A"}</p>
      <p style="margin: 5px 0 0 0;">Track: ${recipient.trackName || "N/A"}</p>
    </div>
    
    <p>Your certificate is attached to this email as a PDF file. You can print it directly or save it for your records.</p>
    
    <p>Thank you for your outstanding participation and dedication. Your creativity and technical excellence made this event truly special!</p>
    
    <p style="margin-top: 30px;">Best regards,<br><strong>Tejas Singhal</strong><br>President, Google Developer Groups @ Penn State</p>
  </div>
  
  <div class="footer">
    <p>Google Developer Groups @ Penn State<br>Solution Challenge 2026</p>
  </div>
</body>
</html>`;

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "GDG PSU <noreply@gdgpsu.dev>",
          to: recipient.userEmail,
          subject: `🎓 Your ${certificate.name} - GDG PSU Solution Challenge 2026`,
          html: emailHtml,
          attachments: [
            {
              filename: filename,
              content: pdfBuffer,
            },
          ],
        });

        // Record as sent
        await db.certificateSent.create({
          data: {
            certificateId,
            userId: recipient.userId,
            teamId: teamId || null,
          },
        });

        sent++;
      } catch (error) {
        console.error(`Failed to send certificate to ${recipient.userEmail}:`, error);
      }
    }

    return { data: { sent } };
  } catch (error) {
    console.error("Send certificates error:", error);
    return { error: "Failed to send certificates" };
  }
}

// ─── Search Users and Teams ─────────────────────────────────────────────────

export async function searchUsersAndTeams(query: string): Promise<{
  users: Array<{ id: string; name: string; email: string; teamName?: string }>;
  teams: Array<{ id: string; name: string; memberCount: number; trackName?: string }>;
}> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { users: [], teams: [] };
  }

  const searchTerm = query.trim().toLowerCase();
  if (searchTerm.length < 2) {
    return { users: [], teams: [] };
  }

  try {
    // Search users
    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        teamMemberships: {
          include: {
            team: { select: { name: true } },
          },
        },
      },
    });

    // Search teams
    const teams = await db.team.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        members: { select: { id: true } },
        track: { select: { name: true } },
      },
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name || u.email,
        email: u.email,
        teamName: u.teamMemberships[0]?.team.name,
      })),
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        memberCount: t.members.length,
        trackName: t.track?.name,
      })),
    };
  } catch {
    return { users: [], teams: [] };
  }
}

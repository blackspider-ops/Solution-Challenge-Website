"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificateSchema, sendCertificateSchema, type CertificateInput, type SendCertificateInput } from "@/lib/schemas/certificate";
import { Resend } from "resend";
import PDFDocument from "pdfkit";

const resend = new Resend(process.env.RESEND_API_KEY);

// Google brand colors
const COLORS = {
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
  blue: '#4285F4',
  orange: '#F09300',
  gray: '#5f6368',
  darkGray: '#202124',
  lightGray: '#e8eaed',
};

// Function to create certificate PDF using PDFKit
async function createCertificatePdf(name: string, team: string, track: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Generating PDF for ${name}...`);
      
      // Create PDF in landscape mode (11in x 8.5in)
      const doc = new PDFDocument({
        size: [792, 612], // 11in x 8.5in in points (72 points per inch)
        layout: 'landscape',
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Draw colored border at top
      const borderHeight = 8;
      const gradientStops = [
        { pos: 0, color: COLORS.red },
        { pos: 0.25, color: COLORS.yellow },
        { pos: 0.5, color: COLORS.green },
        { pos: 0.75, color: COLORS.blue },
        { pos: 1, color: COLORS.red },
      ];
      
      // Top border (simulate gradient with rectangles)
      const borderWidth = 792;
      const segmentWidth = borderWidth / 4;
      doc.rect(0, 0, segmentWidth, borderHeight).fill(COLORS.red);
      doc.rect(segmentWidth, 0, segmentWidth, borderHeight).fill(COLORS.yellow);
      doc.rect(segmentWidth * 2, 0, segmentWidth, borderHeight).fill(COLORS.green);
      doc.rect(segmentWidth * 3, 0, segmentWidth, borderHeight).fill(COLORS.blue);

      // Bottom border
      doc.rect(0, 604, segmentWidth, borderHeight).fill(COLORS.red);
      doc.rect(segmentWidth, 604, segmentWidth, borderHeight).fill(COLORS.yellow);
      doc.rect(segmentWidth * 2, 604, segmentWidth, borderHeight).fill(COLORS.green);
      doc.rect(segmentWidth * 3, 604, segmentWidth, borderHeight).fill(COLORS.blue);

      // Inner border
      doc.rect(30, 30, 732, 552)
        .lineWidth(2)
        .stroke(COLORS.lightGray);

      // Google logo text
      doc.fontSize(56).font('Helvetica-Bold');
      const logoY = 80;
      let logoX = 200;
      
      doc.fillColor(COLORS.red).text('G', logoX, logoY, { continued: true });
      logoX += doc.widthOfString('G');
      doc.fillColor(COLORS.yellow).text('o', logoX, logoY, { continued: true });
      logoX += doc.widthOfString('o');
      doc.fillColor(COLORS.green).text('o', logoX, logoY, { continued: true });
      logoX += doc.widthOfString('o');
      doc.fillColor(COLORS.blue).text('g', logoX, logoY, { continued: true });
      logoX += doc.widthOfString('g');
      doc.fillColor(COLORS.red).text('l', logoX, logoY, { continued: true });
      logoX += doc.widthOfString('l');
      doc.fillColor(COLORS.yellow).text('e', logoX, logoY);

      // "developers" text
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor(COLORS.orange)
        .text('developers', 0, 145, { align: 'center' });

      // Certificate title
      doc.fontSize(38)
        .font('Helvetica-Light')
        .fillColor(COLORS.darkGray)
        .text('Certificate of Participation', 0, 200, { align: 'center' });

      // "This is to certify that"
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('THIS IS TO CERTIFY THAT', 0, 250, { align: 'center' });

      // Recipient name (large, blue)
      doc.fontSize(48)
        .font('Helvetica-Bold')
        .fillColor(COLORS.blue)
        .text(name, 0, 280, { align: 'center' });

      // Description
      const description = 'has successfully participated in the GDG @ Penn State Solution Challenge 2026,\ndemonstrating creativity, technical excellence, and commitment to building\ninnovative solutions for real-world challenges.';
      doc.fontSize(14)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text(description, 80, 350, { align: 'center', width: 632 });

      // Details section (Team, Track, Event)
      const detailsY = 430;
      const detailSpacing = 200;
      
      // Team
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('TEAM', 150, detailsY, { width: 150, align: 'center' });
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(COLORS.darkGray)
        .text(team || 'N/A', 150, detailsY + 20, { width: 150, align: 'center' });

      // Track
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('TRACK', 320, detailsY, { width: 150, align: 'center' });
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(COLORS.darkGray)
        .text(track || 'N/A', 320, detailsY + 20, { width: 150, align: 'center' });

      // Event
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('EVENT', 490, detailsY, { width: 150, align: 'center' });
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(COLORS.darkGray)
        .text('April 11-12, 2026', 490, detailsY + 20, { width: 150, align: 'center' });

      // Signature section
      const signatureY = 520;
      
      // Signature line
      doc.moveTo(80, signatureY)
        .lineTo(280, signatureY)
        .stroke(COLORS.lightGray);

      // Signature name (cursive-style)
      doc.fontSize(28)
        .font('Helvetica-Oblique')
        .fillColor('#000000')
        .text('Tejas', 80, signatureY + 10);

      // Signature title
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('President\nGoogle Developer Groups @ Penn State', 80, signatureY + 45);

      // VERIFIED stamp (circle)
      const stampX = 350;
      const stampY = signatureY + 30;
      const stampRadius = 45;
      
      doc.circle(stampX, stampY, stampRadius)
        .lineWidth(4)
        .stroke(COLORS.red);
      
      doc.circle(stampX, stampY, stampRadius - 8)
        .lineWidth(2)
        .stroke(COLORS.red);

      doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(COLORS.red)
        .text('VERIFIED', stampX - 30, stampY - 15, { width: 60, align: 'center' });
      
      doc.fontSize(20)
        .text('✓', stampX - 10, stampY - 5);
      
      doc.fontSize(8)
        .font('Helvetica-Bold')
        .text('GDG PSU', stampX - 25, stampY + 15, { width: 50, align: 'center' });

      // Date issued
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor(COLORS.gray)
        .text('DATE ISSUED', 600, signatureY, { width: 112, align: 'right' });
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(COLORS.darkGray)
        .text('April 12, 2026', 600, signatureY + 20, { width: 112, align: 'right' });

      // Corner decorations
      const cornerSize = 40;
      const cornerOffset = 40;
      
      // Top-left
      doc.moveTo(cornerOffset, cornerOffset + cornerSize)
        .lineTo(cornerOffset, cornerOffset)
        .lineTo(cornerOffset + cornerSize, cornerOffset)
        .lineWidth(3)
        .opacity(0.1)
        .stroke(COLORS.red);

      // Top-right
      doc.opacity(0.1)
        .moveTo(792 - cornerOffset - cornerSize, cornerOffset)
        .lineTo(792 - cornerOffset, cornerOffset)
        .lineTo(792 - cornerOffset, cornerOffset + cornerSize)
        .stroke(COLORS.yellow);

      // Bottom-left
      doc.opacity(0.1)
        .moveTo(cornerOffset, 612 - cornerOffset - cornerSize)
        .lineTo(cornerOffset, 612 - cornerOffset)
        .lineTo(cornerOffset + cornerSize, 612 - cornerOffset)
        .stroke(COLORS.green);

      // Bottom-right
      doc.opacity(0.1)
        .moveTo(792 - cornerOffset - cornerSize, 612 - cornerOffset)
        .lineTo(792 - cornerOffset, 612 - cornerOffset)
        .lineTo(792 - cornerOffset, 612 - cornerOffset - cornerSize)
        .stroke(COLORS.blue);

      doc.end();
      console.log('PDF generation complete');
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
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
        // Generate PDF from certificate data
        let pdfBuffer: Buffer;
        let filename: string;
        
        try {
          pdfBuffer = await createCertificatePdf(
            recipient.userName,
            recipient.teamName || 'N/A',
            recipient.trackName || 'N/A'
          );
          filename = `${certificate.name.replace(/\s+/g, '_')}_${recipient.userName.replace(/\s+/g, '_')}.pdf`;
          console.log(`PDF generated successfully for ${recipient.userName}`);
        } catch (pdfError) {
          console.error(`PDF generation failed for ${recipient.userName}:`, pdfError);
          // Skip this recipient if PDF fails
          continue;
        }

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

        // Record as sent (skip if already sent for Tejas to allow testing)
        const existingRecord = await db.certificateSent.findFirst({
          where: {
            certificateId,
            userId: recipient.userId,
          },
        });

        if (!existingRecord) {
          await db.certificateSent.create({
            data: {
              certificateId,
              userId: recipient.userId,
              teamId: teamId || null,
            },
          });
        }

        sent++;
        console.log(`Successfully sent certificate to ${recipient.userEmail}`);
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

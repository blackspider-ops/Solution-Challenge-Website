"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { certificateSchema, sendCertificateSchema, type CertificateInput, type SendCertificateInput } from "@/lib/schemas/certificate";
import { Resend } from "resend";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const resend = new Resend(process.env.RESEND_API_KEY);

// Google brand colors (converted to RGB 0-1 scale)
const COLORS = {
  red: rgb(0.918, 0.263, 0.208),      // #EA4335
  yellow: rgb(0.984, 0.737, 0.016),   // #FBBC04
  green: rgb(0.204, 0.659, 0.325),    // #34A853
  blue: rgb(0.259, 0.522, 0.957),     // #4285F4
  orange: rgb(0.941, 0.576, 0),       // #F09300
  gray: rgb(0.373, 0.388, 0.408),     // #5f6368
  darkGray: rgb(0.125, 0.129, 0.141), // #202124
  lightGray: rgb(0.910, 0.918, 0.929),// #e8eaed
  black: rgb(0, 0, 0),
};

// Function to create certificate PDF using pdf-lib
async function createCertificatePdf(name: string, team: string, track: string): Promise<Buffer> {
  try {
    console.log(`Generating PDF for ${name}...`);
    
    // Create PDF in landscape mode (11in x 8.5in = 792pt x 612pt)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([792, 612]);
    
    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const { width, height } = page.getSize();

    // Draw colored border at top (8pt height)
    const borderHeight = 8;
    const segmentWidth = width / 4;
    page.drawRectangle({ x: 0, y: height - borderHeight, width: segmentWidth, height: borderHeight, color: COLORS.red });
    page.drawRectangle({ x: segmentWidth, y: height - borderHeight, width: segmentWidth, height: borderHeight, color: COLORS.yellow });
    page.drawRectangle({ x: segmentWidth * 2, y: height - borderHeight, width: segmentWidth, height: borderHeight, color: COLORS.green });
    page.drawRectangle({ x: segmentWidth * 3, y: height - borderHeight, width: segmentWidth, height: borderHeight, color: COLORS.blue });

    // Draw colored border at bottom
    page.drawRectangle({ x: 0, y: 0, width: segmentWidth, height: borderHeight, color: COLORS.red });
    page.drawRectangle({ x: segmentWidth, y: 0, width: segmentWidth, height: borderHeight, color: COLORS.yellow });
    page.drawRectangle({ x: segmentWidth * 2, y: 0, width: segmentWidth, height: borderHeight, color: COLORS.green });
    page.drawRectangle({ x: segmentWidth * 3, y: 0, width: segmentWidth, height: borderHeight, color: COLORS.blue });

    // Draw inner border rectangle
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: COLORS.lightGray,
      borderWidth: 2,
    });

    // Google logo text (centered at top)
    const logoSize = 56;
    const logoY = height - 100;
    let logoX = 200;
    
    page.drawText('G', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.red });
    logoX += boldFont.widthOfTextAtSize('G', logoSize);
    page.drawText('o', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.yellow });
    logoX += boldFont.widthOfTextAtSize('o', logoSize);
    page.drawText('o', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.green });
    logoX += boldFont.widthOfTextAtSize('o', logoSize);
    page.drawText('g', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.blue });
    logoX += boldFont.widthOfTextAtSize('g', logoSize);
    page.drawText('l', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.red });
    logoX += boldFont.widthOfTextAtSize('l', logoSize);
    page.drawText('e', { x: logoX, y: logoY, size: logoSize, font: boldFont, color: COLORS.yellow });

    // "developers" text
    const devText = 'developers';
    const devSize = 16;
    const devWidth = regularFont.widthOfTextAtSize(devText, devSize);
    page.drawText(devText, {
      x: (width - devWidth) / 2,
      y: height - 135,
      size: devSize,
      font: regularFont,
      color: COLORS.orange,
    });

    // Certificate title
    const titleText = 'Certificate of Participation';
    const titleSize = 38;
    const titleWidth = regularFont.widthOfTextAtSize(titleText, titleSize);
    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: height - 200,
      size: titleSize,
      font: regularFont,
      color: COLORS.darkGray,
    });

    // "THIS IS TO CERTIFY THAT"
    const certifyText = 'THIS IS TO CERTIFY THAT';
    const certifySize = 12;
    const certifyWidth = regularFont.widthOfTextAtSize(certifyText, certifySize);
    page.drawText(certifyText, {
      x: (width - certifyWidth) / 2,
      y: height - 250,
      size: certifySize,
      font: regularFont,
      color: COLORS.gray,
    });

    // Recipient name (large, blue)
    const nameSize = 48;
    const nameWidth = boldFont.widthOfTextAtSize(name, nameSize);
    page.drawText(name, {
      x: (width - nameWidth) / 2,
      y: height - 310,
      size: nameSize,
      font: boldFont,
      color: COLORS.blue,
    });

    // Description (multi-line)
    const descSize = 14;
    const descLines = [
      'has successfully participated in the GDG @ Penn State Solution Challenge 2026,',
      'demonstrating creativity, technical excellence, and commitment to building',
      'innovative solutions for real-world challenges.',
    ];
    
    let descY = height - 360;
    descLines.forEach((line) => {
      const lineWidth = regularFont.widthOfTextAtSize(line, descSize);
      page.drawText(line, {
        x: (width - lineWidth) / 2,
        y: descY,
        size: descSize,
        font: regularFont,
        color: COLORS.gray,
      });
      descY -= 20;
    });

    // Details section (Team, Track, Event)
    const detailsY = 180;
    const labelSize = 10;
    const valueSize = 16;
    
    // Team
    const teamLabel = 'TEAM';
    const teamLabelWidth = regularFont.widthOfTextAtSize(teamLabel, labelSize);
    page.drawText(teamLabel, {
      x: 200 - teamLabelWidth / 2,
      y: detailsY + 30,
      size: labelSize,
      font: regularFont,
      color: COLORS.gray,
    });
    const teamValue = team || 'N/A';
    const teamValueWidth = boldFont.widthOfTextAtSize(teamValue, valueSize);
    page.drawText(teamValue, {
      x: 200 - teamValueWidth / 2,
      y: detailsY + 10,
      size: valueSize,
      font: boldFont,
      color: COLORS.darkGray,
    });

    // Track
    const trackLabel = 'TRACK';
    const trackLabelWidth = regularFont.widthOfTextAtSize(trackLabel, labelSize);
    page.drawText(trackLabel, {
      x: 396 - trackLabelWidth / 2,
      y: detailsY + 30,
      size: labelSize,
      font: regularFont,
      color: COLORS.gray,
    });
    const trackValue = track || 'N/A';
    const trackValueWidth = boldFont.widthOfTextAtSize(trackValue, valueSize);
    page.drawText(trackValue, {
      x: 396 - trackValueWidth / 2,
      y: detailsY + 10,
      size: valueSize,
      font: boldFont,
      color: COLORS.darkGray,
    });

    // Event
    const eventLabel = 'EVENT';
    const eventLabelWidth = regularFont.widthOfTextAtSize(eventLabel, labelSize);
    page.drawText(eventLabel, {
      x: 592 - eventLabelWidth / 2,
      y: detailsY + 30,
      size: labelSize,
      font: regularFont,
      color: COLORS.gray,
    });
    const eventValue = 'April 11-12, 2026';
    const eventValueWidth = boldFont.widthOfTextAtSize(eventValue, valueSize);
    page.drawText(eventValue, {
      x: 592 - eventValueWidth / 2,
      y: detailsY + 10,
      size: valueSize,
      font: boldFont,
      color: COLORS.darkGray,
    });

    // Signature section
    const signatureY = 90;
    
    // Signature line
    page.drawLine({
      start: { x: 80, y: signatureY + 40 },
      end: { x: 280, y: signatureY + 40 },
      thickness: 1,
      color: COLORS.lightGray,
    });

    // Signature name (italic for cursive effect)
    page.drawText('Tejas', {
      x: 80,
      y: signatureY + 45,
      size: 28,
      font: italicFont,
      color: COLORS.black,
    });

    // Signature title
    page.drawText('President', {
      x: 80,
      y: signatureY + 20,
      size: 11,
      font: regularFont,
      color: COLORS.gray,
    });
    page.drawText('Google Developer Groups @ Penn State', {
      x: 80,
      y: signatureY + 5,
      size: 11,
      font: regularFont,
      color: COLORS.gray,
    });

    // VERIFIED stamp (circles)
    const stampX = 350;
    const stampY = signatureY + 40;
    const stampRadius = 45;
    
    // Outer circle
    page.drawCircle({
      x: stampX,
      y: stampY,
      size: stampRadius,
      borderColor: COLORS.red,
      borderWidth: 4,
      opacity: 0.75,
    });
    
    // Inner circle
    page.drawCircle({
      x: stampX,
      y: stampY,
      size: stampRadius - 8,
      borderColor: COLORS.red,
      borderWidth: 2,
      opacity: 0.75,
    });

    // Stamp text
    const verifiedText = 'VERIFIED';
    const verifiedWidth = boldFont.widthOfTextAtSize(verifiedText, 11);
    page.drawText(verifiedText, {
      x: stampX - verifiedWidth / 2,
      y: stampY + 10,
      size: 11,
      font: boldFont,
      color: COLORS.red,
    });
    
    // Draw checkmark as "V" since ✓ isn't supported
    page.drawText('V', {
      x: stampX - 6,
      y: stampY - 5,
      size: 20,
      font: boldFont,
      color: COLORS.red,
    });
    
    const gdgText = 'GDG PSU';
    const gdgWidth = boldFont.widthOfTextAtSize(gdgText, 8);
    page.drawText(gdgText, {
      x: stampX - gdgWidth / 2,
      y: stampY - 20,
      size: 8,
      font: boldFont,
      color: COLORS.red,
    });

    // Date issued
    page.drawText('DATE ISSUED', {
      x: 650,
      y: signatureY + 40,
      size: 10,
      font: regularFont,
      color: COLORS.gray,
    });
    page.drawText('April 12, 2026', {
      x: 630,
      y: signatureY + 20,
      size: 13,
      font: boldFont,
      color: COLORS.darkGray,
    });

    // Corner decorations (L-shapes)
    const cornerSize = 40;
    const cornerOffset = 40;
    const cornerOpacity = 0.1;
    
    // Top-left (red)
    page.drawLine({
      start: { x: cornerOffset, y: height - cornerOffset },
      end: { x: cornerOffset, y: height - cornerOffset - cornerSize },
      thickness: 3,
      color: COLORS.red,
      opacity: cornerOpacity,
    });
    page.drawLine({
      start: { x: cornerOffset, y: height - cornerOffset },
      end: { x: cornerOffset + cornerSize, y: height - cornerOffset },
      thickness: 3,
      color: COLORS.red,
      opacity: cornerOpacity,
    });

    // Top-right (yellow)
    page.drawLine({
      start: { x: width - cornerOffset, y: height - cornerOffset },
      end: { x: width - cornerOffset, y: height - cornerOffset - cornerSize },
      thickness: 3,
      color: COLORS.yellow,
      opacity: cornerOpacity,
    });
    page.drawLine({
      start: { x: width - cornerOffset, y: height - cornerOffset },
      end: { x: width - cornerOffset - cornerSize, y: height - cornerOffset },
      thickness: 3,
      color: COLORS.yellow,
      opacity: cornerOpacity,
    });

    // Bottom-left (green)
    page.drawLine({
      start: { x: cornerOffset, y: cornerOffset },
      end: { x: cornerOffset, y: cornerOffset + cornerSize },
      thickness: 3,
      color: COLORS.green,
      opacity: cornerOpacity,
    });
    page.drawLine({
      start: { x: cornerOffset, y: cornerOffset },
      end: { x: cornerOffset + cornerSize, y: cornerOffset },
      thickness: 3,
      color: COLORS.green,
      opacity: cornerOpacity,
    });

    // Bottom-right (blue)
    page.drawLine({
      start: { x: width - cornerOffset, y: cornerOffset },
      end: { x: width - cornerOffset, y: cornerOffset + cornerSize },
      thickness: 3,
      color: COLORS.blue,
      opacity: cornerOpacity,
    });
    page.drawLine({
      start: { x: width - cornerOffset, y: cornerOffset },
      end: { x: width - cornerOffset - cornerSize, y: cornerOffset },
      thickness: 3,
      color: COLORS.blue,
      opacity: cornerOpacity,
    });

    const pdfBytes = await pdfDoc.save();
    console.log(`PDF generation complete, size: ${pdfBytes.length} bytes`);
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('PDF generation error:', error);
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

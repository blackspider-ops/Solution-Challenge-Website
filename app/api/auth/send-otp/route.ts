import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || "Solution Challenge <noreply@gdgpsu.dev>";

export async function POST(request: NextRequest) {
  try {
    const { email, context } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // For password reset, check if user exists first
    if (context === "password-reset") {
      const { db } = await import("@/lib/db");
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json(
          { 
            error: "No account found with this email. Please sign up first.",
            notRegistered: true 
          },
          { status: 404 }
        );
      }

      // Check if user signed up with OAuth (no password)
      if (!user.password) {
        return NextResponse.json(
          { 
            error: "This account uses social login (Google/GitHub/Microsoft). Please sign in using that method instead.",
            oauthAccount: true
          },
          { status: 400 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    // Determine email content based on context
    const isPasswordReset = context === "password-reset";
    const subject = isPasswordReset 
      ? "Reset Your Solution Challenge Password" 
      : "Verify Your Email - Solution Challenge 2026";
    
    const title = isPasswordReset ? "Password Reset" : "Email Verification";
    const message = isPasswordReset
      ? "You requested to reset your password for Solution Challenge 2026. Use the code below to continue:"
      : "Welcome to Solution Challenge 2026! Use the code below to verify your email and complete your registration:";

    // Send OTP email
    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <!-- Main Container -->
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <img src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" alt="GDG PSU" style="width: 60px; height: 60px; margin-bottom: 20px;" />
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${title}</h1>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #374151; text-align: center;">
                            ${message}
                          </p>
                          
                          <!-- OTP Code Box -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 30px; margin: 20px 0; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
                                  <p style="margin: 0 0 10px 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Verification Code</p>
                                  <p style="margin: 0; font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
                                    ${otp}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Timer Info -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                            <tr>
                              <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 20px;">
                                  ⏱️ <strong>Important:</strong> This code expires in 10 minutes. Don't share it with anyone for security reasons.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="text-align: center; padding-bottom: 20px;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Presented by</p>
                                <p style="margin: 0; font-size: 16px; color: #374151; font-weight: 700;">Google Developer Groups On Campus, Penn State</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 5px 0; font-size: 12px; color: #9ca3af;">
                                  ${isPasswordReset ? "If you didn't request a password reset, please ignore this email." : "If you didn't create an account, please ignore this email."}
                                </p>
                                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                  © 2026 Solution Challenge. All rights reserved.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                    </table>
                    
                    <!-- Bottom Spacing -->
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 20px;">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                            <a href="https://solutionchallenge.gdgpsu.dev" style="color: rgba(255, 255, 255, 0.9); text-decoration: none; margin: 0 10px;">Visit Website</a>
                            <span style="color: rgba(255, 255, 255, 0.5);">•</span>
                            <a href="https://solutionchallenge.gdgpsu.dev/contact" style="color: rgba(255, 255, 255, 0.9); text-decoration: none; margin: 0 10px;">Contact Us</a>
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
    } else {
      // For development - log OTP to console
      console.log(`OTP for ${email} (${context || 'registration'}): ${otp}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

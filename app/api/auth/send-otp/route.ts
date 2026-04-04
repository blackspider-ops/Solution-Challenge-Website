import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || "Solution Challenge <noreply@gdgpsu.dev>";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    // Send OTP email
    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your Solution Challenge Verification Code",
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
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Email Verification</h1>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                          <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
                            Your verification code for Solution Challenge 2026:
                          </p>
                          
                          <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </p>
                          </div>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
                            This code expires in 10 minutes. Don't share it with anyone.
                          </p>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                            If you didn't request this code, please ignore this email.
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
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting: Store IP addresses and their request timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 messages per hour per IP

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a generic identifier
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Filter out requests outside the time window
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  // Update the map with filtered requests
  rateLimitMap.set(ip, recentRequests);
  
  // Check if limit exceeded
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  // Add current request timestamp
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return false;
}

// Clean up old entries periodically (every 2 hours)
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recentRequests = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );
    if (recentRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recentRequests);
    }
  }
}, 2 * 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. You can send up to 3 messages per hour. Please try again later or use the direct email option." 
        },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = parsed.data;
    
    // Send email via Resend
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Solution Challenge <onboarding@resend.dev>",
      to: "gdg@psu.edu",
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #4b5563; margin-bottom: 5px; }
              .value { color: #1f2937; }
              .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 10px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Solution Challenge Website</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>This message was sent via the Solution Challenge contact form.</p>
                  <p>Reply directly to this email to respond to ${name}.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try the direct email option." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

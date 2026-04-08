import { NextResponse } from "next/server";
import { sendWelcomeAnnouncementToNewUsers } from "@/lib/actions/announcement";

/**
 * Cron job to auto-send welcome announcements to newly registered users
 * This runs once per day at 9:00 AM UTC by Vercel Cron
 * 
 * Configured in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-announcements",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron or has the correct authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendWelcomeAnnouncementToNewUsers();

    return NextResponse.json({
      success: true,
      sent: result.sent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to send announcements" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, deleteOTP } from "@/lib/otp";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendPasswordResetConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = verifyOTP(email, code);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Validate password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one number" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    // Delete OTP after successful password reset
    deleteOTP(email);

    // Send confirmation email (don't fail if email fails)
    try {
      await sendPasswordResetConfirmationEmail(email, user.name || "User");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue anyway - password was reset successfully
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

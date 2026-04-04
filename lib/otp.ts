/**
 * OTP generation and verification utilities
 */

// In-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for an email (expires in 10 minutes)
 */
export function storeOTP(email: string, code: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email.toLowerCase(), { code, expiresAt, attempts: 0 });
}

/**
 * Verify OTP for an email
 */
export function verifyOTP(email: string, code: string): { valid: boolean; error?: string } {
  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return { valid: false, error: "No OTP found. Please request a new one." };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "OTP expired. Please request a new one." };
  }
  
  if (stored.attempts >= 3) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "Too many failed attempts. Please request a new OTP." };
  }
  
  if (stored.code !== code) {
    stored.attempts++;
    return { valid: false, error: "Invalid OTP. Please try again." };
  }
  
  // Valid OTP - remove from store
  otpStore.delete(email.toLowerCase());
  return { valid: true };
}

/**
 * Verify OTP without deleting it (for multi-step flows like password reset)
 */
export function verifyOTPWithoutDelete(email: string, code: string): { valid: boolean; error?: string } {
  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return { valid: false, error: "No OTP found. Please request a new one." };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "OTP expired. Please request a new one." };
  }
  
  if (stored.attempts >= 3) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: "Too many failed attempts. Please request a new OTP." };
  }
  
  if (stored.code !== code) {
    stored.attempts++;
    return { valid: false, error: "Invalid OTP. Please try again." };
  }
  
  // Valid OTP - don't delete, just return success
  return { valid: true };
}

/**
 * Delete OTP for an email (after successful completion)
 */
export function deleteOTP(email: string): void {
  otpStore.delete(email.toLowerCase());
}

/**
 * Clean up expired OTPs (run periodically)
 */
export function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}

// Cleanup every 5 minutes
if (typeof window === "undefined") {
  setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
}

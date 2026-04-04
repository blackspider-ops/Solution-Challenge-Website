/**
 * Login attempt tracking and account lockout
 */

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
  lastAttempt: number;
}

// In-memory store for login attempts (in production, use Redis or database)
const loginAttemptsStore = new Map<string, LoginAttempt>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Check if account is locked
 */
export function isAccountLocked(email: string): { locked: boolean; remainingTime?: number } {
  const attempt = loginAttemptsStore.get(email.toLowerCase());
  
  if (!attempt) {
    return { locked: false };
  }
  
  // Check if lockout has expired
  if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
    const remainingTime = Math.ceil((attempt.lockedUntil - Date.now()) / 1000 / 60);
    return { locked: true, remainingTime };
  }
  
  // Lockout expired, reset
  if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
    loginAttemptsStore.delete(email.toLowerCase());
    return { locked: false };
  }
  
  return { locked: false };
}

/**
 * Record failed login attempt
 */
export function recordFailedLogin(email: string): { locked: boolean; attemptsRemaining: number } {
  const now = Date.now();
  const attempt = loginAttemptsStore.get(email.toLowerCase());
  
  if (!attempt) {
    // First failed attempt
    loginAttemptsStore.set(email.toLowerCase(), {
      count: 1,
      lastAttempt: now,
    });
    return { locked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Reset if last attempt was outside the window
  if (now - attempt.lastAttempt > ATTEMPT_WINDOW) {
    loginAttemptsStore.set(email.toLowerCase(), {
      count: 1,
      lastAttempt: now,
    });
    return { locked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Increment attempt count
  const newCount = attempt.count + 1;
  
  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    loginAttemptsStore.set(email.toLowerCase(), {
      count: newCount,
      lastAttempt: now,
      lockedUntil: now + LOCKOUT_DURATION,
    });
    return { locked: true, attemptsRemaining: 0 };
  }
  
  loginAttemptsStore.set(email.toLowerCase(), {
    count: newCount,
    lastAttempt: now,
  });
  
  return { locked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS - newCount };
}

/**
 * Reset login attempts after successful login
 */
export function resetLoginAttempts(email: string): void {
  loginAttemptsStore.delete(email.toLowerCase());
}

/**
 * Clean up old entries periodically
 */
export function cleanupLoginAttempts(): void {
  const now = Date.now();
  for (const [email, attempt] of loginAttemptsStore.entries()) {
    // Remove if lockout expired and no recent attempts
    if (attempt.lockedUntil && now > attempt.lockedUntil + ATTEMPT_WINDOW) {
      loginAttemptsStore.delete(email);
    }
    // Remove if last attempt was long ago
    else if (!attempt.lockedUntil && now - attempt.lastAttempt > ATTEMPT_WINDOW) {
      loginAttemptsStore.delete(email);
    }
  }
}

// Cleanup every 10 minutes
if (typeof window === "undefined") {
  setInterval(cleanupLoginAttempts, 10 * 60 * 1000);
}

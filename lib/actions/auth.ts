"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/schemas/auth";

export async function signupWithCredentials(
  input: unknown
): Promise<{ error: string } | { data: { id: string } }> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists" };

  const hashed = await bcrypt.hash(password, 12);

  try {
    const user = await db.user.create({
      data: { name, email, password: hashed, role: "participant" },
    });
    return { data: { id: user.id } };
  } catch {
    return { error: "Failed to create account. Please try again." };
  }
}

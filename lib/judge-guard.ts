import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Server-side guard to ensure the user is a judge or admin.
 * Redirects to /dashboard if not authorized.
 */
export async function requireJudge() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "judge" && user?.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}

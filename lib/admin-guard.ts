/**
 * Server-side admin guard.
 * Call at the top of every admin Server Component / action.
 * Returns the session or throws a redirect.
 */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}

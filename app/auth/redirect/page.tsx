import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Post-login redirect handler.
 * Auth.js sends users here after sign-in when no specific callbackUrl is set.
 * We read the session role and route accordingly.
 */
export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session) redirect("/login");

  if (session.user?.role === "admin") redirect("/admin");
  if (session.user?.role === "volunteer") redirect("/volunteer/checkin");
  redirect("/dashboard");
}

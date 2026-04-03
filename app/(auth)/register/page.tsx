import { signIn } from "@/lib/auth";
import { signupWithCredentials } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; name?: string; email?: string }>;
}) {
  const params = await searchParams;
  // Default to homepage instead of auto-redirecting to dashboard
  const callbackUrl = params.callbackUrl ?? "/";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-lg mx-auto mb-4 border border-primary/20">
              <img src="/icon.svg" alt="Solution Challenge" className="w-10 h-10" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Join Solution Challenge 2026
          </p>
        </div>

        {params.error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {decodeURIComponent(params.error)}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-foreground/5 space-y-4">
          <form
            action={async (formData: FormData) => {
              "use server";
              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              
              const result = await signupWithCredentials({
                name,
                email,
                password,
              });

              if ("error" in result) {
                redirect(
                  `/register?error=${encodeURIComponent(result.error)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&callbackUrl=${callbackUrl}`
                );
              }

              // Auto sign-in after successful signup
              await signIn("credentials", {
                email,
                password,
                redirectTo: callbackUrl,
              });
            }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                required
                autoComplete="name"
                defaultValue={params.name ? decodeURIComponent(params.name) : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                defaultValue={params.email ? decodeURIComponent(params.email) : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                required
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            >
              Create account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or sign up with</span>
            </div>
          </div>

          <div className="space-y-2">
            {process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: callbackUrl });
                }}
              >
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </form>
            )}

            {process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && (
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo: callbackUrl });
                }}
              >
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <Github className="w-4 h-4" />
                  Continue with GitHub
                </Button>
              </form>
            )}

            {!process.env.GOOGLE_CLIENT_ID && !process.env.GITHUB_CLIENT_ID && (
              <div className="text-center text-sm text-muted-foreground py-2">
                OAuth providers not configured. Use email/password to sign up.
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href={`/login?callbackUrl=${callbackUrl}`} className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Password must be at least 8 characters with one uppercase letter and one number.
        </p>
      </div>
    </div>
  );
}

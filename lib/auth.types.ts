import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "participant" | "volunteer" | "admin";
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    role?: string;
  }
}

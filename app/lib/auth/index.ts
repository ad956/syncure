import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "your-secret-key-here",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
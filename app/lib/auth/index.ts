import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.AUTH_SECRET || "your-secret-key-here",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
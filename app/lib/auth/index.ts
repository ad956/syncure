import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: {
    provider: "mongodb",
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/syncure",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret-key",
});

export type Session = typeof auth.$Infer.Session;
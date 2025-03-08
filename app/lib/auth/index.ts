import BaseUrl from "@utils/base-url";
import NextAuth, { type NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        usernameOrEmail: { label: "Username or Email", type: "text" },
        role: { label: "Role", type: "text" },
        otp: { label: "OTP", type: "text" },
        action: { label: "Action", type: "text" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const role = credentials.role as string;

        if (
          !credentials?.usernameOrEmail ||
          !role ||
          !credentials?.otp ||
          !credentials?.action
        ) {
          throw new Error("Missing required fields.");
        }

        try {
          const response = await fetch(`${BaseUrl}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "OTP verification failed.");
          }

          const user = await response.json();

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {
          id: user.id as string,
          role: user.role as string,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user = {
          id: token.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: token.user.role,
        } as any;
      }
      return session;
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig);

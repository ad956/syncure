import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { allowedRoles, dbConfig, getModelByRole } from "@utils/index";

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

        if (!allowedRoles.includes(role)) {
          throw new Error("Invalid role.");
        }

        try {
          await dbConfig();
          const UserModel = getModelByRole(role);

          const user = await UserModel.findOne(
            {
              $or: [
                { email: credentials.usernameOrEmail },
                { username: credentials.usernameOrEmail },
              ],
            },
            "_id username firstname lastname otp email profile"
          );

          if (!user) {
            throw new Error("User not found.");
          }

          if (user.otp !== credentials.otp) {
            throw new Error("OTP verification failed.");
          }

          // Clear OTP after successful login
          await UserModel.findByIdAndUpdate(user._id, { otp: "" });

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            image: user.profile,
            role,
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
});

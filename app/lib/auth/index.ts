import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import Patient from "@models/patient";
import dbConfig from "@utils/db";

// Create MongoDB client for better-auth
const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("syncure")),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true
      }
    }
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  secret: process.env.AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  
  // Custom sign-in to integrate with existing users
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "credential") {
        await dbConfig();
        
        // Find existing user in patient collection
        const existingPatient = await Patient.findOne({ email: user.email });
        
        if (existingPatient) {
          // Add role to user object
          user.role = existingPatient.role || "patient";
        }
      }
      return true;
    }
  }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
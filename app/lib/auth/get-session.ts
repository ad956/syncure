import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSession() {
  try {
    const cookieStore = cookies();
    
    // Try JWT auth-token first (for demo users)
    const jwtToken = cookieStore.get("auth-token")?.value;
    if (jwtToken) {
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || "fallback-secret") as any;
      // Return in expected format
      return {
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        }
      };
    }
    
    // Fallback to better-auth cookie
    const betterAuthToken = cookieStore.get("better-auth.session_token")?.value;
    if (betterAuthToken) {
      // For better-auth tokens, return null for now since we need different handling
      return null;
    }

    return null;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}
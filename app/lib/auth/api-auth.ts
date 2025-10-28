import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createErrorResponse } from "@lib/api-response";

export function getApiSession() {
  try {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get("auth-token")?.value;
    
    if (jwtToken) {
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || "fallback-secret") as any;
      return { user: { id: decoded.id, email: decoded.email, role: decoded.role } };
    }
    return null;
  } catch {
    return null;
  }
}

export function requireAuth() {
  const session = getApiSession();
  
  if (!session?.user?.id) {
    return { error: createErrorResponse("Unauthorized", 401), session: null };
  }
  
  return { error: null, session };
}
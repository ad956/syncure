import { getApiSession } from "@lib/auth/api-auth";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET() {
  try {
    const session = getApiSession();
    
    if (!session) {
      return createErrorResponse("No session found", 401);
    }
    
    return createSuccessResponse(session);
  } catch (error: any) {
    return createErrorResponse("Session error", 500);
  }
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = [
  "/patient",
  "/receptionist", 
  "/doctor",
  "/hospital",
  "/admin",
];

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  // Check for private routes
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Apply authentication middleware logic to private routes
  if (isPrivateRoute) {
    // TODO: Implement Better Auth authentication check
    // For now, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|signup|admin-login|api/demo-user|api/states|api/get-hospitals|api/city|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.jpg$|.*\\.webp$|error).*)",
  ],
};
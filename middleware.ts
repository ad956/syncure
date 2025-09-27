import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PRIVATE_ROUTES = [
  "/patient",
  "/receptionist", 
  "/doctor",
  "/hospital",
  "/admin",
];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isPrivateRoute) {
    const token = req.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.AUTH_SECRET || "your-secret-key-here"
      );
      
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.user?.role;

      if (!userRole) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const requestedRoute = nextUrl.pathname;
      const isAuthorized = requestedRoute.startsWith(`/${userRole}`);

      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|signup|admin-login|api/demo-user|api/states|api/get-hospitals|api/city|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.jpg$|.*\\.webp$|error).*)",
  ],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@lib/auth";

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
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = session.user.role;
    const requestedRoute = nextUrl.pathname;

    const isAuthorized = PRIVATE_ROUTES.some(
      (route) =>
        requestedRoute.startsWith(route) &&
        requestedRoute.includes(`/${userRole}`)
    );

    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|signup|admin-login|api/demo-user|api/states|api/get-hospitals|api/city|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.jpg$|.*\\.webp$|error).*)",
  ],
};
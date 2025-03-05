import { NextResponse } from "next/server";
import { auth } from "@lib/auth";

const PRIVATE_ROUTES = [
  "/patient",
  "/receptionist",
  "/doctor",
  "/hospital",
  "/admin",
];

export default auth((req) => {
  console.log("path : " + req.nextUrl.pathname);
  console.log("uname : " + req.auth?.user.name);
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Check for private routes
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Apply authentication middleware logic to private routes
  if (isPrivateRoute) {
    // Not authenticated
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = req.auth?.user?.role;
    const requestedRoute = nextUrl.pathname;

    // Ensure user can only access routes matching their role
    const isAuthorized = PRIVATE_ROUTES.some(
      (route) =>
        requestedRoute.startsWith(route) &&
        requestedRoute.includes(`/${userRole}`)
    );

    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!login|signup|admin-login|api/demo-user|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.jpg$|.*\\.webp$|error).*)",
  ],
};

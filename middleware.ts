import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route patterns
const AUTH_ROUTES = ['/login', '/signup', '/admin-login'];
const PUBLIC_API_ROUTES = ['/api/auth', '/api/demo-user', '/api/states', '/api/get-hospitals', '/api/city'];
const PROTECTED_ROUTES = ['/patient', '/doctor', '/hospital', '/admin', '/receptionist'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.') ||
    PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const betterAuthToken = req.cookies.get('better-auth.session_token')?.value;
  const jwtToken = req.cookies.get('auth-token')?.value;
  const hasValidSession = betterAuthToken || jwtToken;
  
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to their dashboard
  if (isAuthRoute && hasValidSession) {
    // Let the auth pages handle the redirect based on user role
    // Don't redirect here, just continue
    return NextResponse.next();
  }

  // For protected routes, add security headers
  if (isProtectedRoute) {
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.jpg$|.*\\.webp$).*)",
  ],
};
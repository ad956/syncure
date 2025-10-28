import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = ['/patient', '/doctor', '/admin', '/receptionist', '/hospital'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const authToken = request.cookies.get('auth-token')?.value;
    const betterAuthToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!authToken && !betterAuthToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|$).*)',
  ],
};
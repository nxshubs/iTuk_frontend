import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoutes = [
  '/dashboard',
  '/subscription',
  '/complete-profile',
  '/onboarding',
  '/provider',
  '/subscription'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;

  if (privateRoutes.some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subscription/:path*',
    '/complete-profile/:path*',
    '/onboarding/:path*',
    '/provider/:path*',
    '/subscription/:path*',
  ],
}
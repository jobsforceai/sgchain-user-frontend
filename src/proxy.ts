import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('sgchain_access_token');
  const { pathname } = req.nextUrl;

  // If the user is authenticated and tries to visit the landing page, redirect to dashboard
  if (token && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If the user is not authenticated and tries to visit a protected path, redirect to login
  const protectedPaths = ['/dashboard', '/wallet', '/profile', '/buy', '/redeem', '/sell', '/history', '/kyc', '/withdraw'];
  if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/wallet/:path*',
    '/profile/:path*',
    '/buy/:path*',
    '/redeem/:path*',
    '/sell/:path*',
    '/history/:path*',
    '/kyc/:path*',
    '/withdraw/:path*',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('sgchain_access_token');

  const protectedPaths = ['/dashboard', '/wallet', '/profile'];
  const { pathname } = req.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/wallet/:path*', '/profile/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('bahrain_session');
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard paths without a session, redirect to login
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. If trying to access auth pages with an active session, redirect to dashboard
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (session) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Configure routes matching middleware execution
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};

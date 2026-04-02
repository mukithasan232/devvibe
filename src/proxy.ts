import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /api/admin routes, but allow /admin/login
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !pathname.startsWith('/admin/login')) {
    const adminSecret = process.env.ADMIN_SECRET;
    
    // If no secret is configured, we allow access for setup, 
    // but in production, this should always be set.
    if (!adminSecret) return NextResponse.next();

    // Check for admin_session cookie or X-Admin-Secret header
    const session = request.cookies.get('admin_session')?.value;
    const headerSecret = request.headers.get('x-admin-secret');

    if (session === adminSecret || headerSecret === adminSecret) {
      return NextResponse.next();
    }

    // If trying to access admin via URL with ?secret=...
    const urlSecret = request.nextUrl.searchParams.get('secret');
    if (urlSecret === adminSecret) {
      const response = NextResponse.redirect(new URL(pathname, request.url));
      response.cookies.set('admin_session', adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ID === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      return response;
    }

    // Unauthorized access
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized Access. Please provide admin credentials.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

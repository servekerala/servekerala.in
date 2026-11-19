// ==========================================================
// SERVEKERALA.IN – EDGE MIDDLEWARE (SERVER-LEVEL SECURITY)
// ==========================================================

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Vanity URL for /submit-event/
  if (pathname === '/submit-event' || pathname === '/submit-event/') {
    return Response.redirect(new URL('/events/submit/', request.url), 301);
  }

  // 2. Admin Route Protection
  if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
    // Allow static assets and dedicated login page
    if (pathname === '/admin/login' || pathname === '/admin/login.html' || pathname.startsWith('/assets/')) {
      return;
    }

    const cookie = request.headers.get('cookie') || '';
    const isAuthenticated = cookie.includes('sk_admin_session=sk_sec_servekerala_admin_2026');

    if (!isAuthenticated) {
      // Rewrite request to professional login page (URL stays clean /admin/)
      return Response.rewrite(new URL('/admin/login.html', request.url));
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/submit-event', '/submit-event/']
};
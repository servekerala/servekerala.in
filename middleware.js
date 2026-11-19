// ==========================================================
// SERVEKERALA.IN – EDGE MIDDLEWARE (SERVER-LEVEL SECURITY)
// ==========================================================

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Vanity URL for /submit-event/
  if (pathname === '/submit-event' || pathname === '/submit-event/') {
    return Response.redirect(new URL('/events/submit/', request.url), 302);
  }

  // 2. Admin Route Protection
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    const cookie = request.headers.get('cookie') || '';
    const isAuthenticated = cookie.includes('sk_admin_session=sk_sec_servekerala_admin_2026');

    if (!isAuthenticated) {
      // Redirect to professional login page
      return Response.redirect(new URL('/admin/login/', request.url), 302);
    }
  }
}

export const config = {
  matcher: ['/admin', '/admin/', '/admin/index.html', '/submit-event', '/submit-event/']
};
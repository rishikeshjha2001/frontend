import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // ==========================================
  // SUBDOMAIN ROUTING
  // ==========================================
  // admin.happylokam.com → /admin/*
  // partner.happylokam.com → /partner/*
  // ==========================================

  const isAdminSubdomain = hostname.startsWith('admin.');
  const isManagerSubdomain = hostname.startsWith('manager.');
  const isPartnerSubdomain = hostname.startsWith('partner.');
  const isLoginSubdomain = hostname.startsWith('login.');
  const isTicketSubdomain = hostname.startsWith('ticket.');

  // If on login subdomain, redirect/rewrite to /login
  if (isLoginSubdomain) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const isApiOrStatic = (p: string) =>
    p.startsWith('/_next') ||
    p.startsWith('/api') ||
    p.startsWith('/sections') ||
    p.startsWith('/section') ||
    p.startsWith('/categories') ||
    p.startsWith('/category') ||
    p.startsWith('/partners') ||
    p.startsWith('/partner/api') ||
    p.startsWith('/uploads') ||
    p.startsWith('/favicon') ||
    p.startsWith('/icon');

  // If on admin subdomain, rewrite to /admin path
  if (isAdminSubdomain) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return handleAuth(request, url, token, 'admin');
    }

    if (!pathname.startsWith('/admin')) {
      if (isApiOrStatic(pathname)) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      return handleAuth(request, url, token, 'admin');
    }

    return handleAuth(request, null, token, 'admin');
  }

  // If on manager subdomain, rewrite to /manager path
  if (isManagerSubdomain) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/manager';
      return handleAuth(request, url, token, 'manager');
    }

    if (!pathname.startsWith('/manager')) {
      if (isApiOrStatic(pathname)) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = `/manager${pathname}`;
      return handleAuth(request, url, token, 'manager');
    }

    return handleAuth(request, null, token, 'manager');
  }

  // If on partner subdomain, rewrite to /partner path
  if (isPartnerSubdomain) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/partner';
      return handleAuth(request, url, token, 'partner');
    }

    if (!pathname.startsWith('/partner')) {
      if (isApiOrStatic(pathname)) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = `/partner${pathname}`;
      return handleAuth(request, url, token, 'partner');
    }

    return handleAuth(request, null, token, 'partner');
  }

  // If on ticket subdomain, rewrite to /ticket path
  if (isTicketSubdomain) {
    if (!pathname.startsWith('/ticket')) {
      if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon') || pathname.startsWith('/icon')) {
        return NextResponse.next();
      }
      const url = request.nextUrl.clone();
      url.pathname = `/ticket${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // ==========================================
  // MAIN DOMAIN ADMIN, MANAGER & PARTNER ACCESS
  // ==========================================
  const isAdminRoute = pathname.startsWith('/admin');
  const isManagerRoute = pathname.startsWith('/manager');
  const isPartnerRoute = pathname.startsWith('/partner');

  if (isAdminRoute) {
    return handleAuth(request, null, token, 'admin');
  }

  if (isManagerRoute) {
    return handleAuth(request, null, token, 'manager');
  }

  if (isPartnerRoute) {
    return handleAuth(request, null, token, 'partner');
  }

  return NextResponse.next();
}

/**
 * Handle authentication for admin, manager & partner routing
 */
function handleAuth(request: NextRequest, rewriteUrl: URL | null, token: string | undefined, type: 'admin' | 'manager' | 'partner') {
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host') || 'happylokam.com';

  const buildRedirectUrl = (path: string) => {
    const cleanHost = host.replace(/:\d+$/, '');
    const url = new URL(path, `${forwardedProto}://${cleanHost}`);
    return url;
  };

  if (!token) {
    const loginUrl = buildRedirectUrl('/login');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const role = decodedPayload.role;

    if (type === 'admin' && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      const loginUrl = buildRedirectUrl('/login');
      return NextResponse.redirect(loginUrl);
    }

    if (type === 'manager' && role !== 'MANAGER' && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      const loginUrl = buildRedirectUrl('/login');
      return NextResponse.redirect(loginUrl);
    }

    if (type === 'partner' && role !== 'PARTNER') {
      const loginUrl = buildRedirectUrl('/login');
      return NextResponse.redirect(loginUrl);
    }

    if (rewriteUrl) {
      return NextResponse.rewrite(rewriteUrl);
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = buildRedirectUrl('/login');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png).*)',
  ]
};

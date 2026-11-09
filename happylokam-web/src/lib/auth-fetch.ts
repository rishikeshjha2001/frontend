/**
 * Authenticated Fetch wrapper
 * Automatically attaches Authorization: Bearer <token> from localStorage
 * and includes credentials for HttpOnly cookies.
 * Also automatically prepends the backend /api/v1 base URL for relative API paths.
 */
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'https://happylokam.com';
};

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let token: string | null = null;
  let isAdmin = false;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') ||
            localStorage.getItem('admin_token') ||
            localStorage.getItem('accessToken') ||
            sessionStorage.getItem('token') ||
            sessionStorage.getItem('admin_token');

    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(String(u.role).toUpperCase())) {
          isAdmin = true;
        }
      }
    } catch {}
  }

  const headers = new Headers(init?.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (isAdmin && !headers.has('x-admin-key')) {
    headers.set('x-admin-key', 'happylokam_admin_master');
  }

  let targetUrl: RequestInfo | URL = input;
  if (typeof input === 'string' && !input.startsWith('http')) {
    const base = getBaseUrl();
    const normalized = input.startsWith('/') ? input : `/${input}`;
    if (base.endsWith('/api/v1')) {
      targetUrl = normalized.startsWith('/api/v1')
        ? `${base.replace(/\/api\/v1$/, '')}${normalized}`
        : `${base}${normalized}`;
    } else {
      targetUrl = normalized.startsWith('/api/v1')
        ? `${base}${normalized}`
        : `${base}/api/v1${normalized}`;
    }
  }

  const response = await fetch(targetUrl, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    const urlStr = targetUrl.toString();
    if (urlStr.includes('/auth/me') || urlStr.includes('/auth/refresh')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return response;
}

export default authFetch;

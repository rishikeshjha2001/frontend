const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'https://happylokam.com';
};

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Needed for HttpOnly cookies
  };

  // Add localStorage token if available (Fixes localhost cross-port cookie drop)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const baseUrl = getBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let fullUrl: string;
  if (baseUrl.endsWith('/api/v1')) {
    if (normalizedEndpoint.startsWith('/api/v1')) {
      fullUrl = `${baseUrl.replace(/\/api\/v1$/, '')}${normalizedEndpoint}`;
    } else {
      fullUrl = `${baseUrl}${normalizedEndpoint}`;
    }
  } else {
    if (normalizedEndpoint.startsWith('/api/v1')) {
      fullUrl = `${baseUrl}${normalizedEndpoint}`;
    } else {
      fullUrl = `${baseUrl}/api/v1${normalizedEndpoint}`;
    }
  }

  const response = await fetch(fullUrl, config);

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    responseData = null;
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    const error = new Error(responseData?.message || 'An error occurred while fetching the data.');
    (error as any).status = response.status;
    (error as any).data = responseData;
    throw error;
  }

  return responseData;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'PUT', data }),
  patch: <T>(endpoint: string, data?: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'PATCH', data }),
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};

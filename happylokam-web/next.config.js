/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'api.happylokam.com' },
      { protocol: 'https', hostname: 'happylokam.com' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://happylokam.com https://*.happylokam.com http://localhost:4000 http://localhost:3000 https://api.happylokam.com https://api.razorpay.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
              "frame-src 'self' https://api.razorpay.com https://*.firebaseapp.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async rewrites() {
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/api\/v1\/?$/, '');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: '/sections',
        destination: `${backendUrl}/api/v1/sections`,
      },
      {
        source: '/sections/:path*',
        destination: `${backendUrl}/api/v1/sections/:path*`,
      },
      {
        source: '/categories',
        destination: `${backendUrl}/api/v1/categories`,
      },
      {
        source: '/categories/:path*',
        destination: `${backendUrl}/api/v1/categories/:path*`,
      },
      {
        source: '/partners',
        destination: `${backendUrl}/api/v1/partners`,
      },
      {
        source: '/partners/:path*',
        destination: `${backendUrl}/api/v1/partners/:path*`,
      },
      {
        source: '/partner/api/:path*',
        destination: `${backendUrl}/api/v1/partners/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

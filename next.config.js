/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['src'],
  },
  async headers() {
    return [
      {
        // Allow the game iframe to load on the escape room page
        source: '/game/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
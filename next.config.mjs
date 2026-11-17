/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/feed',
        destination: '/api/feed',
      },
      {
        source: '/swipe',
        destination: '/api/swipe',
      },
      {
        source: '/matches',
        destination: '/api/matches',
      },
      {
        source: '/reset',
        destination: '/api/reset',
      },
    ];
  },
};

export default nextConfig;

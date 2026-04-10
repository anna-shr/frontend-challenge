import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.thecatapi.com',
      },
    ],
  },
  reactStrictMode: true,
  
  output: 'export',
  
  basePath: '/cat-pinterest-app',
  
  env: {
    NEXT_PUBLIC_BASE_PATH: '/frontend-challenge',
  },
};

export default nextConfig;
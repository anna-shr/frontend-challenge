import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.thecatapi.com',
      },
    ],
    unoptimized: true
  },
  reactStrictMode: true,
  
  output: 'export',
  assetPrefix: isProd ? '/frontend-challenge/cat-pinterest-app' : '',
  basePath: isProd ? '/frontend-challenge/cat-pinterest-app' : '',
  
  env: {
    NEXT_PUBLIC_BASE_PATH: '/frontend-challenge',
  },
};

export default nextConfig;
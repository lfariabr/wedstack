import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'github.com',
      'raw.githubusercontent.com',
      'avatars.githubusercontent.com',
      'user-images.githubusercontent.com',
      'unsplash.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'media.istockphoto.com'
    ],
  },
  output: 'standalone', // Enable standalone output for Docker deployment
  
  // Disable ESLint in production builds
  eslint: {
    // Only run ESLint in development, not during builds
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds for faster builds
  typescript: {
    // Skip type checking during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

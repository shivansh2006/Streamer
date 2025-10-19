// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
  },
  // Prevent lint errors from failing production builds on Netlify
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

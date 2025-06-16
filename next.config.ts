import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/i,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;

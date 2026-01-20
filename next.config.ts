import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5102/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

export default nextConfig;


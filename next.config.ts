import type { NextConfig } from "next";

// Backend origin for API proxy. Default: production URL (Railway). Override with NEXT_PUBLIC_BACKEND_URL for local dev (http://localhost:4000).
const backendOrigin =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:4000/api";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fotograf-kirsti-hovde-storage.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

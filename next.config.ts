import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier hostname con HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite cualquier hostname con HTTP
      },
    ],
  },
};

export default nextConfig;

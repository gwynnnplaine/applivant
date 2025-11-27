import type { NextConfig } from "next";
import { securityHeaders } from "./config/security-headers";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

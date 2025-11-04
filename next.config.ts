import type { NextConfig } from "next";

import "./src/env";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "8mb",
    },
    useCache: true,
    globalNotFound: true,
    reactCompiler: true,
  },
};

export default nextConfig;

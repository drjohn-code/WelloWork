import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/legal/privacy", destination: "/legal#privacy", permanent: true },
      { source: "/legal/terms", destination: "/legal#terms", permanent: true },
      { source: "/legal/cookies", destination: "/legal#cookies", permanent: true },
      {
        source: "/legal/data-processing",
        destination: "/legal#data-processing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

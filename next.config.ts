import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

// Defaults to ./i18n/request.ts — no explicit path argument needed.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

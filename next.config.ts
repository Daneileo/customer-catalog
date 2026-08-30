import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:shop(taurus|scorpio|pisces)",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:shop(taurus|scorpio|pisces)/item/:id",
        destination: "/item/:shop/:id",
        permanent: false,
      },
      {
        source: "/:shop(taurus|scorpio|pisces)/search",
        destination: "/search",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/sirius",
        destination: "/",
        permanent: false,
      },
      {
        source: "/sirius/search",
        destination: "/search",
        permanent: false,
      },
      {
        source: "/sirius/c/:id",
        destination: "/c/:id",
        permanent: false,
      },
      {
        source: "/medved",
        destination: "/",
        permanent: false,
      },
      {
        source: "/medved/search",
        destination: "/search",
        permanent: false,
      },
      {
        source: "/medved/c/:id",
        destination: "/c/:id",
        permanent: false,
      },
      {
        source: "/husky",
        destination: "/mishka",
        permanent: false,
      },
      {
        source: "/husky/search",
        destination: "/mishka/search",
        permanent: false,
      },
      {
        source: "/husky/c/:id",
        destination: "/mishka/c/:id",
        permanent: false,
      },
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

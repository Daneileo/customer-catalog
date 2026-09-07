import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/medved", destination: "/manybrands-1", permanent: false },
      { source: "/medved/search", destination: "/manybrands-1/search", permanent: false },
      { source: "/medved/c/:id", destination: "/manybrands-1/c/:id", permanent: false },
      { source: "/mishka", destination: "/manybrands-2", permanent: false },
      { source: "/mishka/search", destination: "/manybrands-2/search", permanent: false },
      { source: "/mishka/c/:id", destination: "/manybrands-2/c/:id", permanent: false },
      { source: "/c/:id", destination: "/manybrands-1/c/:id", permanent: false },
      { source: "/sirius", destination: "/manybrands-1", permanent: false },
      { source: "/sirius/search", destination: "/manybrands-1/search", permanent: false },
      { source: "/sirius/c/:id", destination: "/manybrands-1/c/:id", permanent: false },
      { source: "/husky", destination: "/manybrands-2", permanent: false },
      { source: "/husky/search", destination: "/manybrands-2/search", permanent: false },
      { source: "/husky/c/:id", destination: "/manybrands-2/c/:id", permanent: false },
      { source: "/master", destination: "/master/manybrands-1", permanent: false },
      { source: "/master/mishka", destination: "/master/manybrands-2", permanent: false },
      { source: "/master/mishka/search", destination: "/master/manybrands-2/search", permanent: false },
      { source: "/master/mishka/c/:id", destination: "/master/manybrands-2/c/:id", permanent: false },
      {
        source:
          "/:shop(taurus|scorpio|pisces|husky|chaosmade|wwfake100|yolo66|luxury233|jimioptical|niuniu6688|west42|dreamremake2|jieyi168x|palmmoose|terryqiuyi|emmaluxury|godmall|hlinjewelry|pikachushop)/item/:id",
        destination: "/item/:shop/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  // Use App Router only, ignore Pages directory
  pageExtensions: ["tsx", "ts", "jsx", "js"]
    .map((ext) => `app.${ext}`)
    .concat(["tsx", "ts", "jsx", "js"]),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/hybridaction/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/trang-chu",
        permanent: true,
      },
      {
        source: "/jobs",
        destination: "/viec-lam",
        permanent: true,
      },
      {
        source: "/jobs/:id",
        destination: "/viec-lam/:id",
        permanent: true,
      },
      {
        source: "/companies",
        destination: "/cong-ty",
        permanent: true,
      },
      {
        source: "/companies/:id",
        destination: "/cong-ty/:id",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/bai-viet",
        permanent: true,
      },
      {
        source: "/blog/:id",
        destination: "/bai-viet/:id",
        permanent: true,
      },
      {
        source: "/QA",
        destination: "/hoi-dap",
        permanent: true,
      },
      {
        source: "/search",
        destination: "/tim-kiem",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/dang-nhap",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/dang-ky",
        permanent: true,
      },
      {
        source: "/register/hr",
        destination: "/dang-ky/nha-tuyen-dung",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

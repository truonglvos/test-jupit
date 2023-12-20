/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/webp"],
    domains: ["stage.whgstage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stage.whgstage.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;

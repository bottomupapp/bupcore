/**
 * Uygulama bupcore.ai/product altında servis ediliyor.
 * BASE_PATH env ile override edilebilir (lokal dev'de "" da olur).
 *
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/product";

const nextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb", // ses kayıtları için
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;

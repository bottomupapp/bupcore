/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // @resvg/resvg-js ships precompiled native `.node` addons (one per
  // platform). Webpack tried to parse them as JS during `next build`
  // and failed with `Module parse failed: Unexpected character ' '`,
  // which broke every deploy after the OG route started importing it.
  // Mark it as a server external so Next leaves it for Node's native
  // require at runtime.
  serverExternalPackages: ["@resvg/resvg-js"],
  // The analyst terminal lives at the singular `/analyst/[name]`. Links
  // shared in the wild (and people typing by habit) use the plural
  // `/analysts/...`, which has no route and 404s. Keep those links alive.
  async redirects() {
    return [
      {
        source: "/analysts/:name",
        destination: "/analyst/:name",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

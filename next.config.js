/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["source.unsplash.com", "images.unsplash.com"],
    unoptimized: true,
  },
  transpilePackages: [
    "@radix-ui/react-dialog",
    "@radix-ui/react-slot",
    "@radix-ui/react-use-callback-ref",
    "@radix-ui/react-compose-refs",
    "@radix-ui/primitive",
    "@radix-ui/react-context",
    "@radix-ui/react-primitive",
    "@radix-ui/react-id",
    "@radix-ui/react-use-controllable-state",
    "@radix-ui/react-collection",
    "@radix-ui/react-direction",
    "@radix-ui/react-dismissable-layer",
    "@radix-ui/react-focus-guards",
    "@radix-ui/react-focus-scope",
    "@radix-ui/react-portal",
    "@radix-ui/react-presence",
    "@radix-ui/react-roving-focus",
    "@radix-ui/react-use-layout-effect",
    "@radix-ui/react-visually-hidden",
  ],
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: [".storybook", "pages", "components", "stories", "styles"],
  },
  compiler: {
    emotion: true,
  },
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/art_crop/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/border_crop/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/large/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/normal/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/png/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/small/**",
      },
    ],
  },
};

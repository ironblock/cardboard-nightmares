/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: [".storybook", "pages", "components", "stories", "styles"],
  },
};

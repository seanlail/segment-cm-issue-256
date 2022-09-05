/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    dirs: ["components", "pages"]
  },
  reactStrictMode: true
};

module.exports = nextConfig;

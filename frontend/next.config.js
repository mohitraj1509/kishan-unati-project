/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid PackFile cache errors on Windows/OneDrive
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig
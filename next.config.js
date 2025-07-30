/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['api.qr-server.com'],
  },
}

module.exports = nextConfig 
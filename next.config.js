/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
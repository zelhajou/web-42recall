/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.intra.42.fr'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
}

export default nextConfig
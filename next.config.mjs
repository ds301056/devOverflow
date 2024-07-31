/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true, // Check if you still need this option
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Match all domains
      },
      {
        protocol: 'http',
        hostname: '*', // Match all domains
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

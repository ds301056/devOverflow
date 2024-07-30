/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true, // Check if you still need this option
    serverComponentsExternalPackages: ['mongoose'],
  },
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

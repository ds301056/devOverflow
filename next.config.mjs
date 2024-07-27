/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true, // Check if you still need this option
    serverComponentsExternalPackages: ['mongoose'],
  },
}

export default nextConfig

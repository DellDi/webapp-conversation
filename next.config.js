/** @type {import('next').NextConfig} */
const { codeInspectorPlugin } = require('code-inspector-plugin')

const nextConfig = {
  // 设置应用的基础路径为 /chat
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    // appDir: true,
  },
  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
    }
    return config
  },
}

module.exports = nextConfig

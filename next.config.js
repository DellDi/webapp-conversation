/** @type {import('next').NextConfig} */
const { codeInspectorPlugin } = require('code-inspector-plugin')

const nextConfig = {
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
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
    // config.module.rules.push({
    //   test: /\.css$/,
    //   use: [
    //     'style-loader',
    //     {
    //       loader: 'css-loader',
    //       options: {
    //         modules: {
    //           localIdentName: '[local]__[hash:base64:5]',
    //         },
    //       },
    //     },
    //     'postcss-loader', // Ensure Tailwind CSS is processed
    //   ],
    // })
    return config
  },
}

module.exports = nextConfig

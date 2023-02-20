/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (
    config,
    { buildId, dev, isServer, nextRuntime, webpack }
  ) => {
    return {
      ...config,
      optimization: {
        ...config.optimization,
        minimize: false,
        minimizer: [],
      },
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false
        }
      },
      // plugins: [
      //   new webpack.DefinePlugin({
      //     BROWSER: true,
      //   }),
      // ],
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

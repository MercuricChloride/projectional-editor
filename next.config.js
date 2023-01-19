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
      // plugins: [
      //   new webpack.DefinePlugin({
      //     BROWSER: true,
      //   }),
      // ],
    }
  },
}

module.exports = nextConfig
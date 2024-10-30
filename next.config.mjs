/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO - fix all TS errors
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      }
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // You can add options here
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;

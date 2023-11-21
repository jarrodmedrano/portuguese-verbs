// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  serverRuntimeConfig: {
    trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
  },
  env: {
    trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

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
  publicRuntimeConfig: {
    // Will be available on both server and client
    trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
  },
  env: {
    trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
  },
};

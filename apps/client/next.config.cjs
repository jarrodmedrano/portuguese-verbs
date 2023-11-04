// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');

const transpilePackages = ['api'];
const reactStrictMode = true;
const output = 'standalone';
const experimental = {
  outputFileTracingRoot: join(__dirname, '../../'),
};

const webpack = (config) => {
  config.watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
  };
  return config;
};

const publicRuntimeConfig = {
  // Will be available on both server and client
  trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
};

const env = {
  trpc_api: process.env.NEXT_PUBLIC_TRPC_API,
};

const headers = async () => {
  return [
    {
      source: '/trpc/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
        {
          key: 'Access-Control-Allow-Headers',
          value:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
      ],
    },
  ];
};

module.exports = {
  transpilePackages,
  reactStrictMode,
  output,
  experimental,
  webpack,
  publicRuntimeConfig,
  env,
  headers,
};

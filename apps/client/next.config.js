const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
const server = process.env.NEXT_PUBLIC_TRPC_API;

// eslint-disable-next-line no-console
console.log('why isnt this working', process.env.NEXT_PUBLIC_TRPC_API);
const rewritesConfig = isDevelopment
  ? [
      {
        source: '/trpc/:path*',
        destination: `${server}/bees/:path*`,
      },
    ]
  : [
      {
        source: '/trpc/:path*',
        destination: `${server}/bees/:path*`,
      },
    ];

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    // eslint-disable-next-line no-console
    console.log('the server', rewritesConfig);
    return rewritesConfig;
  },
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
  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value:
  //             'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

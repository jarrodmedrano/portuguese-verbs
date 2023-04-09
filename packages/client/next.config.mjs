!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
};

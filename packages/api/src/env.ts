import { z } from 'zod';
require('dotenv').config();

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  VERBECC_API: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv: Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined> = {
  VERBECC_API: process.env.VERBECC_API,
  NODE_ENV: process.env.NODE_ENV,
};

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = true;

  const parsed = /** @type {MergedSafeParseReturn} */ isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv); // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  env = new Proxy(parsed.data, {
    get(target: [], prop: string) {
      if (typeof prop !== 'string') return undefined;
      return target[/** @type {keyof typeof target} */ parseInt(prop)];
    },
  });
}

export { env };

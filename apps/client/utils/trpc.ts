import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { TRPCRouter } from 'api';
export const trpc = createTRPCNext<TRPCRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${process.env.NEXT_PUBLIC_TRPC_API}/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

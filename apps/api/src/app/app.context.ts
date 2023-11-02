import { inferAsyncReturnType, initTRPC } from '@trpc/server';

export const createContext = () => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

export const tContext = initTRPC.context<Context>().create();

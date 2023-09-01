import * as trpc from '@trpc/server';

export const createContext = () => {
  return null;
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

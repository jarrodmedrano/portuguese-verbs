import { initTRPC } from '@trpc/server';
export const t = initTRPC.create();
export const appRouter = t.router({});
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

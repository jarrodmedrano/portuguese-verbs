import { router } from '@trpc/server';
import { Context } from './app.context';

export const createRouter = () => {
  return router<Context>();
};

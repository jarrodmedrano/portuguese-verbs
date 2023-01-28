import { z } from 'zod';
import { createRouter } from '../app/app.router';
import { getConjugation } from './verbecc.controller';
import trpc from '@trpc/server';

export const verbecc = createRouter().query('get', {
  input: z.object({
    verb: z.string(),
    mood: z.string().optional(),
  }),
  async resolve({ input }) {
    if (!input) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: `please supply a verb and mood`,
      });
    }
    return getConjugation(input);
  },
});

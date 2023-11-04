import { z } from 'zod';
import { t } from '../app/app.router';
import { getConjugation } from './verbecc.controller';
import trpc from '@trpc/server';

export const verbeccRouter = t.router({
  verbecc: t.router({
    get: t.procedure
      .input(
        z.object({
          verb: z.string(),
          mood: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        if (!input) {
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: `please supply proper formatted params`,
          });
        }
        return await getConjugation(input);
      }),
  }),
});

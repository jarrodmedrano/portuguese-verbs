import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../app/app.router';
import { getVerb, createVerb, getVerbs } from './verb.controller';

export const verbRouter = t.router({
  verb: t.router({
    get: t.procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .query(async ({ input }) => {
        if (!input) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `please supply proper formatted params`,
          });
        }
        return await getVerb(input);
      }),
    getMany: t.procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .query(async ({ input }) => {
        if (!input) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `please supply proper formatted params`,
          });
        }
        return await getVerbs();
      }),
    create: t.procedure.input(z.string().min(3)).mutation(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      return await createVerb(input);
    }),
    createMany: t.procedure.input(z.array(z.string().min(3))).mutation(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      return input.map(async (verb) => await createVerb(verb));
    }),
  }),
});

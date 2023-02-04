import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../app/app.router';
import { getVerb, getVerbs, createVerb } from './verb.controller';

export const verbs = createRouter().query('get', {
  resolve: getVerbs,
});

export const verb = createRouter()
  .query('get', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply a verb name`,
        });
      }
      return getVerb(input);
    },
  })
  .mutation('create', {
    input: z.string().min(3),
    resolve: ({ input }) => createVerb(input),
  })
  .mutation('createMany', {
    input: z.array(z.string().min(3)),
    resolve: ({ input }) => {
      return input.map((verb) => createVerb(verb));
    },
  });

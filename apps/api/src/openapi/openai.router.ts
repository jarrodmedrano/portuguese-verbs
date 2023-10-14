import { z } from 'zod';
import { createRouter } from '../app/app.router';
import { getQuestion } from './openai.controller';
import trpc from '@trpc/server';

export const openai = createRouter().query('get', {
  input: z.object({
    tense: z.string(),
    regularity: z.string(),
    verbType: z.string(),
    difficulty: z.string(),
    language: z.string(),
    preferredLanguage: z.string(),
  }),
  async resolve({ input }) {
    if (!input) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: `please supply a correctly formatted question`,
      });
    }
    return getQuestion(input);
  },
});

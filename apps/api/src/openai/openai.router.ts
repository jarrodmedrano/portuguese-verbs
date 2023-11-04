import { t } from '../app/app.router';
import { getAIQuestion } from './openai.controller';
import * as trpc from '@trpc/server';
import { inputOpenAIQuestion } from './types';

export const openaiRouter = t.router({
  aiQuestion: t.router({
    get: t.procedure.input(inputOpenAIQuestion).query(async ({ input }) => {
      if (!input) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      return await getAIQuestion(input);
    }),
  }),
});

import { createRouter } from '../app/app.router';
import { getQuestion } from './openai.controller';
import * as trpc from '@trpc/server';
import { inputOpenAIQuestion } from './types';

export const openaiRouter = createRouter().mutation('mutate', {
  input: inputOpenAIQuestion,
  resolve: async ({ input }) => {
    if (!input) {
      throw new trpc.TRPCError({
        code: 'BAD_REQUEST',
        message: `Please supply a correctly formatted question.`,
      });
    }
    return getQuestion(input);
  },
});

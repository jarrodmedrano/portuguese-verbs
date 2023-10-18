import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../app/app.router';
import { getQuestion, getQuestions, createQuestion } from './question.controller';
import { inputGetQuestion, inputQuestion } from './types';

export const questions = createRouter().query('get', {
  resolve: getQuestions,
});

export const question = createRouter()
  .query('get', {
    input: inputGetQuestion,
    async resolve({ input }) {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted question`,
        });
      }
      return getQuestion(input);
    },
  })
  .mutation('create', {
    input: inputQuestion,
    resolve: ({ input }) =>
      createQuestion({
        ...input,
        answers: JSON.stringify(input.answers),
      }),
  })
  .mutation('createMany', {
    input: z.array(inputQuestion),
    resolve: ({ input }) => {
      return input.map((question) =>
        createQuestion({
          ...question,
          answers: JSON.stringify(question.answers),
        }),
      );
    },
  });

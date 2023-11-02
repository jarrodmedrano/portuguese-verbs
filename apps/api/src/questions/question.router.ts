import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../app/app.router';
import { getQuestion, getQuestions, createQuestion, createQuestions } from './question.controller';
import { inputGetQuestion, inputQuestion } from './types';

export const questionsRouter = t.router({
  questions: t.procedure.input(inputGetQuestion).query(async ({ input }) => {
    if (!input) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `please supply proper formatted params`,
      });
    }
    const questions = await getQuestions(input);
    return questions;
  }),

  question: t.router({
    get: t.procedure.input(inputQuestion).query(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      const questions = await getQuestion(input);
      return questions;
    }),

    create: t.procedure.input(inputQuestion).mutation(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      const question = await createQuestion(input);
      return question;
    }),

    createMany: t.procedure.input(z.array(inputQuestion)).mutation(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `please supply proper formatted params`,
        });
      }
      const created = await createQuestions(input);
      return created;
    }),
  }),
});

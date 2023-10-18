import { inferAsyncReturnType } from '@trpc/server'; // Assume paths accordingly
import { z } from 'zod';
import { getQuestion } from './openai.controller';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export type GetQuestionOutput = inferAsyncReturnType<typeof getQuestion>;

const chatCompletionRequestMessageSchema = z.object({
  role: z.enum([ChatCompletionRequestMessageRoleEnum.User, ChatCompletionRequestMessageRoleEnum.Assistant]), // use
  content: z.string(),
  name: z.string().optional(),
});

export const inputOpenAIQuestion = z.object({
  tense: z.string(),
  regularity: z.string(),
  verbType: z.string(),
  difficulty: z.string(),
  language: z.string(),
  preferredLanguage: z.string(),
  messages: z.array(chatCompletionRequestMessageSchema),
});

export type GetQuestionInput = z.infer<typeof inputOpenAIQuestion>;
export type GetQuestionResponse = GetQuestionOutput;

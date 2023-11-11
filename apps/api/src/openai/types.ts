import { inferAsyncReturnType } from '@trpc/server'; // Assume paths accordingly
import { z } from 'zod';
import { getAIQuestion } from './openai.controller';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export type GetAIQuestionOutput = inferAsyncReturnType<typeof getAIQuestion>;

const chatCompletionRequestMessageSchema = z.object({
  role: z.enum([ChatCompletionRequestMessageRoleEnum.User, ChatCompletionRequestMessageRoleEnum.Assistant]), // use
  content: z.string(),
  name: z.string().optional(),
});

export const inputOpenAIQuestion = z.object({
  tense: z.string().or(z.array(z.string())).optional(),
  regularity: z.string().or(z.array(z.string())).optional(),
  verbType: z.string().or(z.array(z.string())).optional(),
  difficulty: z.string(),
  language: z.string(),
  preferredLanguage: z.string(),
  messages: z.array(chatCompletionRequestMessageSchema),
});

export type GetQuestionInput = z.infer<typeof inputOpenAIQuestion>;
export type GetQuestionResponse = GetAIQuestionOutput;

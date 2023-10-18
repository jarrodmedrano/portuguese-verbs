import { z } from 'zod';

export const inputGetQuestion = z.object({
  id: z.number().optional(),
  tense: z.string().optional(),
  regularity: z.string().optional(),
  verbType: z.string().optional(),
  difficulty: z.string().optional(),
  language: z.string().optional(),
  preferredLanguage: z.string().optional(),
  text: z.string().optional(),
  translation: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const inputQuestion = z.object({
  id: z.number().optional(),
  tense: z.string(),
  regularity: z.string(),
  verbType: z.string(),
  difficulty: z.string(),
  language: z.string(),
  preferredLanguage: z.string(),
  answers: z.string(),
  text: z.string(),
  translation: z.string(),
  rating: z.number(),
  likes: z.number(),
  dislikes: z.number(),
});

export const getQuestion = z.object({
  id: z.number(),
  tense: z.string(),
  regularity: z.string(),
  verbType: z.string(),
  difficulty: z.string(),
  language: z.string(),
  preferredLanguage: z.string(),
  answers: z.string(),
  text: z.string(),
  translation: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  rating: z.number(),
  likes: z.number(),
  dislikes: z.number(),
});

export type inferredGetQuestionType = z.infer<typeof inputGetQuestion>;

export const inputQuestions = z.array(inputQuestion);
export type inferredQuestionType = z.infer<typeof inputQuestion>;

export const getQuestions = z.array(getQuestion);
export type inferredQuestionsType = z.infer<typeof getQuestions>;

import { z } from 'zod';

export const regularity = z.array(z.string().optional()).optional().or(z.string().optional());
export const verbType = z.array(z.string().optional()).optional().or(z.string().optional());
export const tense = z.array(z.string().optional()).optional().or(z.string().optional());

export type RegularityType = z.infer<typeof regularity>;
export type VerbType = z.infer<typeof verbType>;
export type TenseType = z.infer<typeof tense>;

export const inputGetQuestion = z.object({
  id: z.number().optional(),
  tense,
  regularity,
  verbType,
  difficulty: z.string().optional(),
  language: z.string().optional(),
  preferredLanguage: z.string().optional(),
  text: z.string().optional(),
  translation: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  src: z.string().optional(),
  orderBy: z.array(z.record(z.string())).optional(),
});

export const inputQuestion = z.object({
  id: z.number().optional(),
  tense: z.string(),
  regularity: z.string(),
  verbType: z.string(),
  difficulty: z.string(),
  language: z.string(),
  answers: z.string(),
  text: z.string(),
  translation: z.string(),
  rating: z.number().optional().default(0),
  likes: z.number().optional().default(0),
  dislikes: z.number().optional().default(0),
  src: z.string(),
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
  src: z.string().optional(),
  orderBy: z.array(z.record(z.string())).optional(),
});

export type inferredGetQuestionType = z.infer<typeof inputGetQuestion>;

export const inputQuestions = z.array(inputQuestion);
export type inferredQuestionType = z.infer<typeof inputQuestion>;

export const getQuestions = z.array(getQuestion);
export type inferredQuestionsType = z.infer<typeof getQuestions>;

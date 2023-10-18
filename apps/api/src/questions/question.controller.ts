import { inferredQuestionType, inferredGetQuestionType } from './types';
import prisma from '../db';

export const getQuestions = async (): Promise<any[]> => {
  return prisma.question.findMany();
};

export const getQuestion = async (input: inferredGetQuestionType): Promise<any | null> => {
  const where = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));

  return prisma.question.findFirst({
    where,
  });
};

export const createQuestion = async ({
  tense,
  regularity,
  verbType,
  text,
  translation,
  answers,
  rating,
  likes,
  dislikes,
  difficulty,
  language,
}: inferredQuestionType): Promise<any> => {
  const question = await prisma.question.create({
    data: {
      tense,
      regularity,
      verbType,
      text,
      translation,
      answers,
      rating,
      likes,
      dislikes,
      difficulty,
      language,
    },
  });

  return question;
};

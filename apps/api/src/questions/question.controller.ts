import { inferredQuestionType, inferredGetQuestionType } from './types';
import prisma from '../db';
import { isRegularityType, isTenseType, isVerbType } from '../typeguards';

export const getQuestions = async (
  input: inferredGetQuestionType,
  // orderBy?: {
  //   [key: string]: 'asc' | 'desc';
  // }[],
): Promise<any[]> => {
  const where = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));

  let verbsWhere = {};
  let regularityWhere = {};
  let tenseWhere = {};

  if (where.verbType && isVerbType(where.verbType) && Array.isArray(where.verbType)) {
    verbsWhere = {
      verbType: { in: where.verbType },
    };
  }

  if (where.regularity && isRegularityType(where.regularity) && Array.isArray(where.regularity)) {
    regularityWhere = {
      regularity: { in: where.regularity },
    };
  }

  if (where.tense && isTenseType(where.tense) && Array.isArray(where.tense)) {
    tenseWhere = {
      tense: { in: where.tense },
    };
  }

  delete where.orderBy;

  return prisma.question.findMany({
    orderBy: input?.orderBy || [
      {
        created_at: 'desc',
      },
    ],
    where: {
      ...where,
      ...verbsWhere,
      ...regularityWhere,
      ...tenseWhere,
    },
  });
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
  src,
}: inferredQuestionType): Promise<any> => {
  const question = await prisma.question.create({
    data: {
      tense,
      regularity,
      verbType,
      text,
      translation,
      answers,
      rating: rating || 0,
      likes: likes || 0,
      dislikes: dislikes || 0,
      difficulty,
      language,
      src,
    },
  });

  return question;
};

export const createQuestions = async (input: inferredQuestionType[]): Promise<any> => {
  const question = await prisma.$transaction(
    input.map((question) => {
      return prisma.question.create({
        data: {
          tense: question.tense,
          regularity: question.regularity,
          verbType: question.verbType,
          text: question.text,
          translation: question.translation,
          answers: question.answers,
          rating: question.rating || 0,
          likes: question.likes || 0,
          dislikes: question.dislikes || 0,
          difficulty: question.difficulty,
          language: question.language,
          src: question.src,
        },
      });
    }),
  );

  return question;
};

import { Verb, Conjugations } from '@prisma/client';
import prisma from '../db';

export const getVerbs = async (): Promise<Verb[]> => {
  return prisma.verb.findMany();
};

export const getConjugations = async (): Promise<Conjugations[]> => {
  return prisma.conjugations.findMany();
};

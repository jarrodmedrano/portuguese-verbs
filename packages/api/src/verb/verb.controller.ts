import { Verb } from '@prisma/client';
import prisma from '../db';

export const getVerbs = async (): Promise<Verb[]> => {
  return prisma.verb.findMany();
};

export const getVerb = async ({ name }: { name: string }): Promise<Verb | null> => {
  return prisma.verb.findFirst({
    where: {
      name: {
        equals: name,
      },
    },
  });
};

export const createVerb = async (input: string): Promise<Verb> => {
  const verb = await prisma.verb.create({
    data: { name: input },
  });

  return verb;
};

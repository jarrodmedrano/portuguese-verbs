import { RegularityType, VerbType, verbType, regularity, tense, TenseType } from './questions/types';

export const isVerbType = (input: unknown): input is VerbType => {
  const isVerbType = verbType.safeParse(input);
  return isVerbType.success;
};

export const isRegularityType = (input: unknown): input is RegularityType => {
  const isRegularityType = regularity.safeParse(input);
  return isRegularityType.success;
};

export const isTenseType = (input: unknown): input is TenseType => {
  const isTenseType = tense.safeParse(input);
  return isTenseType.success;
};

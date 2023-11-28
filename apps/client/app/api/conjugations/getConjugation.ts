'use server';

import axios from 'axios';

import 'server-only';

export type Verb = {
  value: {
    [key: string]: Array<string>;
  };
};

export const getConjugation = async ({ verb, mood }: { verb: string; mood?: string }): Promise<Verb> => {
  // eslint-disable-next-line no-console
  console.log('api connected to ', process.env.VERBECC_API);
  // eslint-disable-next-line no-console
  console.log('verb', verb);
  // eslint-disable-next-line no-console
  console.log('mood', mood);
  const response = await axios.get(`${process.env.VERBECC_API}//conjugate/pt/${verb}?mood=${mood}`);
  // eslint-disable-next-line no-console
  console.log('res', response);
  const data = response.data;
  return data;
};

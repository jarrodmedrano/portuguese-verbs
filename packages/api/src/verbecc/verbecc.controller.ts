import axios from 'axios';
require('dotenv').config();

export type Verb = {
  value: {
    [key: string]: Array<string>;
  };
};

export const getConjugation = async ({ verb, mood }: { verb: string; mood?: string }): Promise<Verb> => {
  // eslint-disable-next-line no-console
  console.log('api connected to ', process.env.VERBECC_API);
  const response = await axios.get(`${process.env.VERBECC_API}/conjugate/pt/${verb}?mood=${mood}`);
  const data = response.data;
  return data;
};

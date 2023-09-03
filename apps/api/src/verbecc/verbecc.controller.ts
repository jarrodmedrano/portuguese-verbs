import axios from 'axios';
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
dotenvExpand.expand(config);

export type Verb = {
  value: {
    [key: string]: Array<string>;
  };
};

export const getConjugation = async ({ verb, mood }: { verb: string; mood?: string }): Promise<Verb> => {
  const response = await axios.get(`${process.env.VERBECC_API}/conjugate/pt/${verb}?mood=${mood}`);
  const data = response.data;
  return data;
};

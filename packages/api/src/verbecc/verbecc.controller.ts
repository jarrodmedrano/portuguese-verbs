import axios from 'axios';

export type Verb = {
  value: {
    [key: string]: {
      [key: string]: Array<string>;
    };
  };
};

export const getConjugation = async ({ verb, mood }: { verb: string; mood?: string }): Promise<Verb> => {
  const response = await axios.get(`http://localhost:8000/conjugate/pt/${verb}?mood=${mood}`);
  const data = response.data;
  return data;
};

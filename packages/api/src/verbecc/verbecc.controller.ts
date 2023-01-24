interface Verb {
  value: {
    infinitive: string;
    predicted: string;
    pred_score: number;
    template: string;
    translation_en: string;
    stem: string;
  };
  moods: {
    [key: string]: {
      [key: string]: string[];
    };
  };
}

export const getConjugation = async (): Promise<Verb> => {
  const response = await fetch('http://localhost:8000/conjugate/pt/fazer');
  console.log('response', response);
  const data = await response.json();

  return data;
};

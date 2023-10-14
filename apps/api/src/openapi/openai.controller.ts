const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
dotenvExpand.expand(config);
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export type Question = {
  value: {
    [key: string]: Array<string>;
  };
};

// the english translation should not have a blank space.
// the answer should be the same verb but in different conjugations. Do not include tu or vos form. Do not include the mais que perfecto form.

type InputQuestion = {
  tense: string;
  regularity: string;
  verbType: string;
  difficulty: string;
  language: string;
  preferredLanguage: string;
};

const generatePrompt = (input: InputQuestion) => {
  const { tense, regularity, verbType, difficulty, language, preferredLanguage } = input;
  return `You are a ${language} teacher. Write 3 sentences in ${language} of ${difficulty} that have a missing verb. Also include the answers to guess from. include a translation for ${
    preferredLanguage ?? 'en-us'
  }. The questions should be a javascript array of objects like this: {
    "tense": ${tense},
    "regularity": ${regularity},
    "verbType": ${verbType},
    "text": "Eu ______ café todas as manhãs.",
    "translation": "I drink coffee every morning.",
    "answers": [
      { "id": "a1", "text": "bebo", "isCorrect": true },
      { "id": "a2", "text": "bebe", "isCorrect": false },
      { "id": "a3", "text": "bebemos", "isCorrect": false },
      { "id": "a4", "text": "bebem", "isCorrect": false }
    ]
  }`;
};

export const getQuestion = async (input: InputQuestion): Promise<string | undefined> => {
  // eslint-disable-next-line no-console, no-console
  console.log('api connected to ', process.env.OPENAI_API);
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(input),
      temperature: 0.6,
    });
    // eslint-disable-next-line no-console
    console.log('completion', completion);
    return completion.data.choices[0].text || '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      // eslint-disable-next-line no-console
      console.error(error.response.status, error.response.data);
      return `${error.response.data}`;
    } else {
      return 'An error occurred during your request.';
    }
  }
};

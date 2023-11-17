const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
import { ChatCompletionRequestMessage } from 'openai';

dotenvExpand.expand(config);

export type OpenAiQuestion = {
  value: {
    [key: string]: Array<string>;
  };
};

export type InputOpenAiQuestion = {
  tense?: string | string[];
  regularity?: string | string[];
  verbType?: string | string[];
  difficulty: string;
  language: string;
  preferredLanguage: string;
  messages: ChatCompletionRequestMessage[];
  source?: string;
};

const stringifyArrays = (value: any) => {
  if (typeof value !== 'object') {
    return value;
  } else if (Array.isArray(value)) {
    return value.join(', ');
  }
};

export const getAIQuestion = async (input: InputOpenAiQuestion): Promise<string | undefined> => {
  const { language = 'portuguese', preferredLanguage, tense, regularity, verbType, difficulty, messages } = input;
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const msg = [
    {
      role: 'system',
      content: `You are a ${language} teacher. Respond only with the javascript array of new questions, do not include an explanation. Your output must start with [ and end with ] always.`,
    },
    {
      role: 'user',
      content: `Write 10 sentence(s) in ${language} of ${difficulty || 'A1'} that have a missing verb of ${
        verbType ? stringifyArrays(verbType) : 'any'
      } type in ${regularity ? stringifyArrays(regularity) : 'any'} form and in ${
        tense ? stringifyArrays(tense) : 'any'
      } tense. Also include the answers to guess from. include a translation for ${
        preferredLanguage ?? 'en-us'
      }. the answer should be the same verb but in different conjugations. Do not include tu or vos form. Do not include the mais que perfecto form. Do not repeat questions. The questions should be an array of objects in this format but randomize the questions don't take this example literally: {${JSON.stringify(
        [
          {
            tense: tense,
            regularity: regularity,
            verbType: verbType,
            text: 'Eu ______ café todas as manhãs.',
            translation: 'I drink coffee every morning.',
            answers: [
              { id: 'a1', text: 'bebo', isCorrect: true },
              { id: 'a2', text: 'bebe', isCorrect: false },
              { id: 'a3', text: 'bebemos', isCorrect: false },
              { id: 'a4', text: 'bebem', isCorrect: false },
            ],
            src: 'generated',
          },
        ],
      )}}`,
    },
    ...messages,
  ];

  const body = JSON.stringify({
    messages: msg,
    model: 'gpt-3.5-turbo-1106',
    stream: false,
  });
  // eslint-disable-next-line no-console
  console.log('body', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    const data = await response.json();

    // eslint-disable-next-line no-console
    console.log('data', data);
    return data;
  } catch (error) {
    if (error.response) {
      // eslint-disable-next-line no-console
      console.error(error.response.status, error.response.data);
      return `${error.response.data}`;
    } else {
      return 'An error occurred during your request.';
    }
  }
};

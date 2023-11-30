'use server';

import axios from 'axios';
import 'server-only';
import { Question } from '../../../src/components/Quiz/QuizApp';
export const postQuestions = async (args: Question[]) => {
  try {
    // eslint-disable-next-line no-console
    console.log('me', process.env.NEXT_PUBLIC_TRPC_API);
    // eslint-disable-next-line no-console
    console.log('args', args);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_TRPC_API}/trpc/question.createMany?batch=1`, {
      '0': args,
    });
    // eslint-disable-next-line no-console
    console.log('res', res);
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

'use server';

import axios from 'axios';
import 'server-only';
export const getAiQuestions = async ({ ...args }) => {
  try {
    // eslint-disable-next-line no-console
    console.log('result api', args);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_TRPC_API}/trpc/aiQuestion.mutate?batch=1`, {
      '0': {
        ...args,
      },
    });
    // eslint-disable-next-line no-console
    console.log('result api', res);
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

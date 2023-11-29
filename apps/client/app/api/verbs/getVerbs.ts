'use server';

import axios from 'axios';
import 'server-only';
export const getVerbs = async ({ ...args }) => {
  try {
    // eslint-disable-next-line no-console
    console.log('me', process.env.NEXT_PUBLIC_TRPC_API);
    // eslint-disable-next-line no-console
    console.log('args', args);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TRPC_API}/trpc/verb.get?batch=1&input=${JSON.stringify({
        '0': args,
      })}`,
    );
    // eslint-disable-next-line no-console
    console.log('res', res);
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

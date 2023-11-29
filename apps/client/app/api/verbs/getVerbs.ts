'use server';

import axios from 'axios';
import 'server-only';
export const getVerbs = async ({ ...args }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TRPC_API}/trpc/verb.get?batch=1&input=${JSON.stringify({
        '0': args,
      })}`,
    );
    return res.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

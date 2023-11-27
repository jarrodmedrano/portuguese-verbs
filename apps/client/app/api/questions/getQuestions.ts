'use server';

import axios from 'axios';

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import 'server-only';
export const getQuestions = async ({ ...args }) => {
  try {
    // eslint-disable-next-line no-console
    console.log('me', process.env.NEXT_PUBLIC_TRPC_API);
    // eslint-disable-next-line no-console
    console.log('args', args);
    const res = await axios.get(
      `http://api:8080/trpc/questions,questions?batch=1&input=${JSON.stringify({
        '0': args,
        '1': args,
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

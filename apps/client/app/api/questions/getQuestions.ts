import { notFound } from 'next/navigation';

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import 'server-only';
import { Question } from '../../../src/components/Quiz/QuizApp';

export const getQuestions = async () => {
  const res = await fetch(
    `http://localhost:4000/trpc/questions,questions?batch=1&input=%7B%220%22%3A%7B%22language%22%3A%22pt-br%22%2C%22orderBy%22%3A%5B%7B%22created_at%22%3A%22desc%22%7D%5D%7D%2C%221%22%3A%7B%22language%22%3A%22pt-br%22%7D%7D`,
  );
  // eslint-disable-next-line no-console
  console.log('res', res);

  if (!res.ok) {
    // Render the closest `error.js` Error Boundary
    throw new Error('Something went wrong!');
  }

  const reviews = (await res.json()) as Question[];

  if (reviews.length === 0) {
    // Render the closest `not-found.js` Error Boundary
    notFound();
  }

  return reviews;
};

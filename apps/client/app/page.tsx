'use server';
// Import your Client Component
import HomePage from './home-page';

export default async function Page() {
  // const response = await getQuestions();
  // // eslint-disable-next-line no-console
  // console.log('data', response);
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  //@ts-ignore this error
  return <HomePage />;
}

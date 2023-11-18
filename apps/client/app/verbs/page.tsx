// Import your Client Component
import Verbs from './verbs-page';
// export const getServerSideProps = async () => {
//   // eslint-disable-next-line no-console
//   console.log('api url', process.env.API_URL);
//   return {
//     props: {
//       apiUrl: process.env.API_URL || 'http://localhost:4000',
//     },
//   };
// };

export default async function Page() {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <Verbs apiUrl={process.env.API_URL || 'http://localhost:4000'} />;
}

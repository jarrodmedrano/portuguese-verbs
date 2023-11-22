// Import your Client Component
import HomePage from './home-page';
import getConfig from 'next/config';

export default async function Page() {
  const { env } = getConfig() || {};

  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <HomePage apiUrl={env?.trpc_api} />;
}

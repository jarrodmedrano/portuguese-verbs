// Import your Client Component
import HomePage from './home-page';

export default async function Page() {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <HomePage apiUrl={process.env.NEXT_PUBLIC_TRPC_API || 'localhost:4000'} />;
}

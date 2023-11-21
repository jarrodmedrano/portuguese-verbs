// Import your Client Component
import Verbs from './verbs-page';
export default async function Page() {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <Verbs apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} />;
}

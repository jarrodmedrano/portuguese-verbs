'use client';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';
import { useEnvContext } from 'next-runtime-env';

const HomePage = () => {
  const { NEXT_PUBLIC_TRPC_API } = useEnvContext();
  // eslint-disable-next-line no-console
  console.log('public', NEXT_PUBLIC_TRPC_API);

  return (
    <WithQueryWrapper apiUrl={NEXT_PUBLIC_TRPC_API || ''}>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default HomePage;

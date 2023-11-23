'use client';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';
import { useEnvContext } from 'next-runtime-env';
import getConfig from 'next/config';

const HomePage = () => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() || {};
  // eslint-disable-next-line no-console
  console.log('public', publicRuntimeConfig);
  // eslint-disable-next-line no-console
  console.log('server', serverRuntimeConfig);

  const { NEXT_PUBLIC_TRPC_API } = useEnvContext();
  // eslint-disable-next-line no-console
  console.log('env public', NEXT_PUBLIC_TRPC_API);
  // eslint-disable-next-line no-console
  console.log('apiUrl', process.env.NEXT_PUBLIC_TRPC_API);

  return (
    <WithQueryWrapper apiUrl={NEXT_PUBLIC_TRPC_API || 'localhost:4000'}>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default HomePage;

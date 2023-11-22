'use client';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';
import { useEnvContext } from 'next-runtime-env';
import getConfig from 'next/config';

const HomePage = ({ apiUrl }: { apiUrl: string }) => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() || {};
  // eslint-disable-next-line no-console
  console.log('public', publicRuntimeConfig);
  // eslint-disable-next-line no-console
  console.log('server', serverRuntimeConfig);

  const { NEXT_PUBLIC_TRPC_API } = useEnvContext();
  // eslint-disable-next-line no-console
  console.log('env public', NEXT_PUBLIC_TRPC_API);
  // eslint-disable-next-line no-console
  console.log('apiUrl', apiUrl);

  return (
    <WithQueryWrapper apiUrl={apiUrl}>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default HomePage;

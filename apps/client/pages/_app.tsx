import '../src/styles/global.css';
import getConfig from 'next/config';
import { AppProps } from 'next/app';
import { ReactNode, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { client, trpc } from '../src/services';

const { publicRuntimeConfig } = getConfig();

declare module 'react-query/types/react/QueryClientProvider' {
  // eslint-disable-next-line no-unused-vars
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const App = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line no-console
  console.log('TRPC RUN ON', publicRuntimeConfig.trpc_api);

  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${publicRuntimeConfig.trpc_api}/trpc`,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;

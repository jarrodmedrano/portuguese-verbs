import '../src/styles/global.css';
import { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { client, trpc } from '../src/services';

const App = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line no-console
  console.log('TRPC RUN ON', process.env.NEXT_PUBLIC_TRPC_API);

  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${process.env.NEXT_PUBLIC_TRPC_API}/trpc`,
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

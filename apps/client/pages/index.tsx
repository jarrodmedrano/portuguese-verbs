import type { InferGetServerSidePropsType } from 'next';
import { VerbTableWithSearchContext } from '../src/components/VerbTable';
import { SearchContextProvider } from '../src/contexts/SearchContext';
import { ReactNode, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { client, trpc } from '../src/services';

export const getServerSideProps = async () => {
  return {
    props: {
      apiUrl: process.env.API_URL || 'http://localhost:4000',
    },
  };
};

declare module 'react-query/types/react/QueryClientProvider' {
  // eslint-disable-next-line no-unused-vars
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const Home = ({ apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // eslint-disable-next-line no-console
  console.log('BLORG!', apiUrl);

  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${apiUrl}/trpc`,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <SearchContextProvider>
          <VerbTableWithSearchContext
            filters={[
              'presente',
              'pretérito-imperfeito',
              'pretérito-perfeito',
              // 'pretérito-mais-que-perfeito',
              'futuro-do-presente',
              // 'pretérito-perfeito-composto',
              // 'pretérito-mais-que-perfeito-composto',
              // 'pretérito-mais-que-perfeito-anterior',
              // 'futuro-do-presente-composto',
            ]}
            verb="fazer"
            key="fazer"
            mood="indicativo"
          />
        </SearchContextProvider>
      </QueryClientProvider>{' '}
    </trpc.Provider>
  );
};

export default Home;

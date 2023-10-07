import type { InferGetServerSidePropsType } from 'next';
import { VerbTableWithSearchContext } from '../src/components/VerbTable';
import { ReactNode } from 'react';

export const getServerSideProps = async () => {
  return {
    props: {
      apiUrl: process.env.APP_URL || 'http://localhost:4000',
    },
  };
};

declare module 'react-query/types/react/QueryClientProvider' {
  // eslint-disable-next-line no-unused-vars
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const Verbs = ({ apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // eslint-disable-next-line no-console
  console.log('api url', apiUrl);

  return (
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
  );
};

export default Verbs;

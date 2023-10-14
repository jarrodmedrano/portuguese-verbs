import { InferGetServerSidePropsType } from 'next';
import WithQueryWrapper from '../src/components/QueryWrapper';
import { VerbTableWithSearchContext } from '../src/components/VerbTable';

export const getServerSideProps = async () => {
  return {
    props: {
      apiUrl: process.env.APP_URL || 'http://localhost:4000',
    },
  };
};

const Verbs = ({ apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <WithQueryWrapper apiUrl={apiUrl}>
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
    </WithQueryWrapper>
  );
};

export default Verbs;

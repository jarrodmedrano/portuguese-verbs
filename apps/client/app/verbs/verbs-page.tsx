'use client';
import WithQueryWrapper from '../../src/components/QueryWrapper';
import { VerbTableWithSearchContext } from '../../src/components/VerbTable';
import Navbar from '../../src/components/Quiz/Navbar';
import { useEnvContext } from 'next-runtime-env';

const Verbs = () => {
  const { NEXT_PUBLIC_TRPC_API } = useEnvContext();
  // eslint-disable-next-line no-console
  console.log('public', NEXT_PUBLIC_TRPC_API);

  const myEnvVar = process.env.NEXT_PUBLIC_TRPC_API;
  // eslint-disable-next-line no-console
  console.log('myEnvVar', myEnvVar);
  return (
    <WithQueryWrapper apiUrl={NEXT_PUBLIC_TRPC_API || ''}>
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
      <Navbar />
    </WithQueryWrapper>
  );
};

export default Verbs;

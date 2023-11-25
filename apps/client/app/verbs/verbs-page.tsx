'use client';
import WithQueryWrapper from '../../src/components/QueryWrapper';
import { VerbTableWithSearchContext } from '../../src/components/VerbTable';
import Navbar from '../../src/components/Quiz/Navbar';

const Verbs = () => {
  return (
    <WithQueryWrapper>
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

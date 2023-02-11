import type { NextPage } from 'next';
import { VerbTableWithSearchContext } from '../src/components/VerbTable';
import { SearchContextProvider } from '../src/contexts/SearchContext';

const Home: NextPage = () => {
  return (
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
  );
};

export default Home;

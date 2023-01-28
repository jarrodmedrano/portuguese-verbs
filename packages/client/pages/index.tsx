import type { NextPage } from 'next';
import { VerbTable } from '../src/components/VerbTable';

const Home: NextPage = () => {
  const commonVerbs = [
    'fazer',
    'ir',
    'dirigir',
    'levar',
    'parar',
    'falar',
    'prestar',
    'ficar',
    'chegar',
    'deixar',
    'andar',
    'ser',
    'ter',
    'estar',
    'poder',
    'fazer',
    'ir',
    'haver',
    'dizer',
    'dar',
    'ver',
    'saber',
    'querer',
    'ficar',
    'dever',
    'passar',
    'vir',
    'chegar',
    'falar',
    'deixar',
    'encontrar',
  ];
  return (
    <>
      <VerbTable
        filters={[
          'presente',
          // 'pretérito-imperfeito',
          // 'pretérito-perfeito',
          // 'pretérito-mais-que-perfeito',
          // 'futuro-do-presente',
          // 'pretérito-perfeito-composto',
          // 'pretérito-mais-que-perfeito-composto',
          // 'pretérito-mais-que-perfeito-anterior',
          // 'futuro-do-presente-composto',
        ]}
        verb={'fazer'}
        key={'fazer'}
        mood="indicativo"
      />
    </>
  );
};

export default Home;

import type { NextPage } from 'next';
import { useState } from 'react';
import { VerbTable } from '../src/components/VerbTable';

const Home: NextPage = () => {
  const commonVerbs = [
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
      {commonVerbs.map((verb) => (
        <VerbTable verb={verb} key={verb} />
      ))}
    </>
  );
};

export default Home;

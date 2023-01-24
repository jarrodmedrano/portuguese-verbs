import type { NextPage } from 'next';
import { useState } from 'react';
import { VerbTable } from '../src/components/VerbTable';

const Home: NextPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-teal-500 font-sans">
      <VerbTable />
    </div>
  );
};

export default Home;

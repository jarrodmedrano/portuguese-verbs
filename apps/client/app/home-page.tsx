'use client';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';
import { trpc } from '../utils/trpc';

const HomePage = () => {
  return (
    <WithQueryWrapper>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default trpc.withTRPC(HomePage);

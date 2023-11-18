'use client';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';

const HomePage = ({ apiUrl }: { apiUrl: string }) => {
  return (
    <WithQueryWrapper apiUrl={apiUrl}>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default HomePage;

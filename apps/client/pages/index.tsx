import { InferGetServerSidePropsType } from 'next';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';

export const getServerSideProps = async () => {
  return {
    props: {
      apiUrl: process.env.APP_URL || 'http://localhost:4000',
    },
  };
};

const Home = ({ apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <WithQueryWrapper apiUrl={apiUrl}>
      <Navbar />
      <QuizApp />
    </WithQueryWrapper>
  );
};

export default Home;

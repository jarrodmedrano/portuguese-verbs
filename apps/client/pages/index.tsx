import { InferGetServerSidePropsType } from 'next';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';
import Navbar from '../src/components/Quiz/Navbar';

export const getServerSideProps = async () => {
  // eslint-disable-next-line no-console
  console.log('api url', process.env.API_URL);
  return {
    props: {
      apiUrl: process.env.API_URL || 'http://localhost:4000',
    },
  };
};

const Home = ({ apiUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <WithQueryWrapper apiUrl={apiUrl}>
      <QuizApp />
      <Navbar />
    </WithQueryWrapper>
  );
};

export default Home;

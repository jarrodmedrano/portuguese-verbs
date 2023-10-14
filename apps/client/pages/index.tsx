import { InferGetServerSidePropsType } from 'next';
import WithQueryWrapper from '../src/components/QueryWrapper';
import QuizApp from '../src/components/Quiz/QuizApp';

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
      <QuizApp />
    </WithQueryWrapper>
  );
};

export default Home;

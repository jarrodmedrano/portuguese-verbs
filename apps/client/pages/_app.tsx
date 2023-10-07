import '../src/styles/global.css';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps & { apiUrl: string }) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default App;

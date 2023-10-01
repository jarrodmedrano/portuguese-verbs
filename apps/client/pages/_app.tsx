import '../src/styles/global.css';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';

declare module 'react-query/types/react/QueryClientProvider' {
  // eslint-disable-next-line no-unused-vars
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;

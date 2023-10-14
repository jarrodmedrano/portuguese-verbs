// @ts-nocheck
'use client';
import { SearchContextProvider } from '../contexts/SearchContext';
import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from '../services';
import { AppContextProvider } from '../contexts/AppContext';

type WithQueryWrapperProps = {
  children: ReactNode;
  apiUrl: string;
};

const WithQueryWrapper = ({ children, apiUrl }: WithQueryWrapperProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${apiUrl}/trpc`,
    }),
  );

  return (
    // TODO: FIX THESE STUPID ERRORS IN REACT QUERY
    //@ts-ignore this
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <SearchContextProvider>{children}</SearchContextProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default WithQueryWrapper;

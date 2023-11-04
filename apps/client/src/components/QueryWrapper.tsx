'use client';
import { SearchContextProvider } from '../contexts/SearchContext';
import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../services';
import { AppContextProvider } from '../contexts/AppContext';

type WithQueryWrapperProps = {
  children: ReactNode;
  apiUrl: string;
};

const WithQueryWrapper = ({ children, apiUrl }: WithQueryWrapperProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${apiUrl}/trpc`,
        }),
      ],
    }),
  );

  return (
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

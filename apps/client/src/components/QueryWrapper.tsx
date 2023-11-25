'use client';
import { SearchContextProvider } from '../contexts/SearchContext';
import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContextProvider } from '../contexts/AppContext';

type WithQueryWrapperProps = {
  children: ReactNode;
};

const WithQueryWrapper = ({ children }: WithQueryWrapperProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>{children}</SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
};

export default WithQueryWrapper;

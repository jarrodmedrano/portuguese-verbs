// @ts-nocheck
'use client';
import { SearchContextProvider } from '../contexts/SearchContext';
import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from '../services';
import { Sidebar } from './Sidebar';

type WithQueryWrapperProps = {
  children: ReactNode;
  apiUrl: string;
};

const WithQueryWrapper = ({ children, apiUrl }: WithQueryWrapperProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

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

  const handleSidebarClick = () => {
    setSidebarIsOpen((prev) => !prev);
  };

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
        <SearchContextProvider>
          {children}
          <aside
            id="default-sidebar"
            className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
            aria-label="Sidebar"
          >
            <Sidebar handleClick={handleSidebarClick} isOpen={sidebarIsOpen} />
          </aside>
        </SearchContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default WithQueryWrapper;

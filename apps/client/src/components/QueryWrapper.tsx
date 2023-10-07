import { SearchContextProvider } from '../contexts/SearchContext';
import React, { ReactNode, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { client, trpc } from '../services';
import { Sidebar } from './Sidebar';

type WithQueryWrapperProps = {
  children: ReactNode;
  apiUrl: string;
};

const WithQueryWrapper = ({ children, apiUrl }: WithQueryWrapperProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarIsOpen((prev) => !prev);
  };
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `${apiUrl}/trpc`,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
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

import React from 'react';

interface SearchContextProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchContext = React.createContext<SearchContextProps>({
  search: '',
  setSearch: () => {},
});

export const SearchContextProvider = ({ children }: { children: any }) => {
  const [search, setSearch] = React.useState<string>('');

  return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>;
};

export const withSearchContext = (Component: React.FC<any>) => {
  const SearchContextConsumer = (props: any) => {
    return <SearchContext.Consumer>{(context) => <Component {...props} {...context} />}</SearchContext.Consumer>;
  };

  return SearchContextConsumer;
};

import React from 'react';

interface SearchContextProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  partialSearch: string;
  setPartialSearch: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchContext = React.createContext<SearchContextProps>({
  search: '',
  setSearch: () => '',
  partialSearch: '',
  setPartialSearch: () => '',
});

export const SearchContextProvider = ({ children }: { children: any }) => {
  const [search, setSearch] = React.useState<string>('');
  const [partialSearch, setPartialSearch] = React.useState<string>('');

  return (
    <SearchContext.Provider value={{ search, setSearch, partialSearch, setPartialSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const withSearchContext = (Component: React.FC<any>) => {
  const SearchContextConsumer = (props: any) => {
    return <SearchContext.Consumer>{(context) => <Component {...props} {...context} />}</SearchContext.Consumer>;
  };

  return SearchContextConsumer;
};

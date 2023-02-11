import { trpc } from './../../services/index';
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
export const useSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>([]);
  const debouncedQuery = useDebounce(query, 500);
  const res = trpc.useQuery(['verb.get', { name: debouncedQuery }]);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      setIsSearching(false);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (res) {
      setResults(res);
    }
  }, [res]);

  return {
    results,
    isSearching,
  };
};

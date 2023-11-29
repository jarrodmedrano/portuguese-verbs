'use client';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { getVerbs } from '../../../app/api/verbs/getVerbs';
export const useSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 1000);
  const [results, setResults] = useState<any[]>([]);
  // const results = trpc.verb.getMany;

  const handleGetVerbs: () => Promise<void> = useCallback(async () => {
    const result = await getVerbs({
      name: debouncedQuery,
    });
    const data = result[0].result.data;
    // eslint-disable-next-line no-console
    console.log('data', result);
    setResults(data);
    // return data;
  }, [debouncedQuery, setResults]);

  useEffect(() => {
    if (query) {
      handleGetVerbs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedQuery, setIsSearching]);

  return {
    results,
    isSearching,
  };
};

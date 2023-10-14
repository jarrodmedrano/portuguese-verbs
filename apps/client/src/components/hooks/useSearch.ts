'use client';
import { trpc } from './../../services/index';
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { UseQueryResult } from 'react-query';
export const useSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 1000);
  //@ts-ignore bullshit
  const results: UseQueryResult<unknown> = trpc.useQuery(['verb.get']);

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

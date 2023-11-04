'use client';
import { trpc } from './../../services/index';
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
export const useSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 1000);
  const results = trpc.verb.getMany;

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

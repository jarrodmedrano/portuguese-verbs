import { renderHook } from '@testing-library/react-hooks';
import { expect, it, describe, vi } from 'vitest';
import { useSearch } from './useSearch';
import { trpc } from './../../services/index';

describe('useSearch', () => {
  const date = new Date(Date.now());

  it('should return the same value', () => {
    // @ts-ignore - this is a mock
    vi.spyOn(trpc, 'useQuery').mockReturnValue({
      data: {
        created_at: date,
        id: 6,
        name: 'fazer',
        updated_at: date,
      },
    });

    const { result } = renderHook(() => useSearch('test'));
    expect(result.current).toStrictEqual({
      isSearching: true,
      results: {
        data: {
          created_at: date,
          id: 6,
          name: 'fazer',
          updated_at: date,
        },
      },
    });
  });
});

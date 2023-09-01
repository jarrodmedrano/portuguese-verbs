import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should return the same value', () => {
    const { result } = renderHook(() => useDebounce('test', 1000));
    expect(result.current).toBe('test');
  });
});

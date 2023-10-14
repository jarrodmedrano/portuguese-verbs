import { describe, it, expect } from 'vitest';
import { AppContextProvider } from './AppContext';

describe('SearchContext', () => {
  it('should be defined', () => {
    expect(AppContextProvider).toBeDefined();
  });
});

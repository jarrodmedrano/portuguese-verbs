import { describe, it, expect } from 'vitest';
import { useConjugation } from './useConjugation';

describe('use conjugation hook', () => {
  it('should return the correct columns', () => {
    const data = {
      value: {
        present: ['a', 'b', 'c'],
        imperfect: ['d', 'e', 'f'],
        future: ['g', 'h', 'i'],
      },
    };
    const values = {
      present: true,
      imperfect: false,
      future: true,
    };
    const { columns } = useConjugation({ data, values });
    expect(columns).toEqual([
      { field: 'pronoun', use: 'pronoun' },
      { field: 'present', use: 'present' },
      { field: 'future', use: 'future' },
    ]);
  });

  it('should return the correct rows', () => {
    const data = {
      value: {
        present: ['a', 'b', 'c'],
        imperfect: ['d', 'e', 'f'],
        future: ['g', 'h', 'i'],
      },
    };
    const values = {
      present: true,
      imperfect: false,
      future: true,
    };
    const { rows } = useConjugation({ data, values });
    expect(rows).toEqual([
      { pronoun: 'eu', present: 'a', imperfect: 'd', future: 'g' },
      { pronoun: 'ele/ela/voce', present: 'b', imperfect: 'e', future: 'h' },
      { pronoun: 'nós', present: 'c', imperfect: 'f', future: 'i' },
    ]);
  });
});

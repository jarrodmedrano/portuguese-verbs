import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export const useDarkSide = (): [string, Dispatch<SetStateAction<string>>] => {
  const [theme, setTheme] = useState<string>(
    typeof window !== 'undefined' && localStorage.theme !== undefined ? localStorage?.theme : 'dark',
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme) {
      root.classList.remove('light');
      root.classList.remove('dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    mql.addEventListener('change', () => {
      if (mql.matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    });

    return () => mql.removeEventListener('change', () => {});
  }, []);

  return [theme, setTheme];
};

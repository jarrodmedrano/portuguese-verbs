import { ChangeEventHandler } from 'react';
import { useDarkSide } from './hooks/useDarkSide';

export const Switcher = () => {
  const [theme, setTheme] = useDarkSide();

  const toggleDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <>
      <input
        name="theme"
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleDarkMode}
        size={30}
        className="mr-2"
      />
      <label htmlFor="theme" className="block">
        <span className="block text-sm font-medium text-slate-700">{theme}</span>
      </label>
    </>
  );
};

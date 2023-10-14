import { ChangeEventHandler } from 'react';
import { useDarkSide } from './hooks/useDarkSide';
import { PropsWithChildren } from 'react';

export const Switcher = ({ showLabel }: { showLabel: boolean }): PropsWithChildren<any> => {
  const [theme, setTheme] = useDarkSide();

  const toggleDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          name="theme"
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleDarkMode}
          size={30}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        {showLabel && (
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {theme === 'light' ? `🌞` : `🌙`}
          </span>
        )}
      </label>
    </>
  );
};

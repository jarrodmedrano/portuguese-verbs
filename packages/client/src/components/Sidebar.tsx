import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '../contexts/SearchContext';
import { SearchBar } from './SearchBar';
import { Switcher } from './Switcher';

export const Sidebar = ({ handleClick, isOpen }: { handleClick: () => void; isOpen: boolean }) => {
  const [isOpenClass, setIsOpenClass] = useState('justify-center');
  const { partialSearch, setPartialSearch, setSearch } = useContext(SearchContext);

  useEffect(() => {
    if (!isOpen) {
      setIsOpenClass('justify-center');
    } else {
      setIsOpenClass('w-full px-3');
    }
  }, [isOpen]);

  return (
    <div
      className={classNames(
        `flex h-full flex-col items-center overflow-hidden  bg-gray-900 text-gray-400 ${
          isOpen ? 'w-64' : 'w-16'
        } transition-all duration-300 ease-in-out`,
        `${isOpen ? 'shadow-lg' : ''}`,
      )}
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4  dark:bg-gray-800">
        <ul className="space-y-2">
          <li
            className={classNames(
              `flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:text-white dark:text-white ${isOpenClass}`,
            )}
          >
            <a
              className={classNames(
                `mt-2 flex h-12 w-full items-center  justify-center rounded hover:bg-gray-700 hover:text-gray-300 `,
              )}
              href="#"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 fill-current"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              {isOpen && (
                <span className="ml-2  text-sm font-bold">
                  <span className="h-12 w-12 text-lg">🇧🇷</span> Portuguese Verbs
                </span>
              )}
            </a>
          </li>
          <li
            className={classNames(
              `flex items-center rounded-lg  p-2 text-base font-normal text-gray-900 hover:text-white dark:text-white ${isOpenClass}`,
            )}
          >
            <Switcher showLabel={isOpen} />
          </li>

          <li
            className={classNames(
              `flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:text-white dark:text-white ${isOpenClass}`,
            )}
          >
            {!isOpen ? (
              <a
                className={classNames(
                  `mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-700 hover:text-gray-300`,
                )}
                href="#"
                onClick={handleClick}
              >
                <svg
                  className="h-6 w-6 stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </a>
            ) : (
              <SearchBar options={[partialSearch]} onChange={setPartialSearch} onSubmit={setSearch} />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

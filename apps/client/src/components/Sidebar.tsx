import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '../contexts/SearchContext';
import { SearchBar } from './SearchBar';
import { Switcher } from './Switcher';
import Link from 'next/link';
import { Checkboxes } from './Quiz/Checkboxes';

export const Sidebar = ({
  handleClick,
  isOpen,
  onCheckBoxSelect,
}: {
  handleClick: () => void;
  isOpen: boolean;
  onCheckBoxSelect: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}) => {
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
      className={`flex h-full flex-col items-center overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 shadow-lg' : 'w-16'
      }`}
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-2 py-2 dark:bg-gray-800">
        <ul className="space-y-1">
          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <a
              className="flex h-10 w-full items-center justify-center hover:text-gray-300"
              href="#"
              onClick={handleClick}
            >
              <svg
                className="mr-2 h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              {isOpen && (
                <span>
                  <span className="text-md h-10 w-10">🇧🇷</span> Portuguese Verbs
                </span>
              )}
            </a>
          </li>

          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <Switcher showLabel={isOpen} />
          </li>

          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <Link
              className="flex h-10 w-full items-center justify-start hover:text-gray-300"
              href="/#"
              onClick={handleClick}
            >
              Home
            </Link>
          </li>

          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <Link
              className="flex h-10 w-full items-center justify-start hover:text-gray-300"
              href="/verbs"
              onClick={handleClick}
            >
              Table of Verbs
            </Link>
          </li>

          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            {!isOpen ? (
              <a
                className="flex h-10 w-10 items-center justify-center hover:text-gray-300"
                href="#"
                onClick={handleClick}
              >
                <svg
                  className="h-5 w-5 stroke-current"
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
        <Checkboxes handleCheckbox={onCheckBoxSelect} />
      </div>
    </div>
  );
};

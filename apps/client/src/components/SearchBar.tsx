import classNames from 'classnames';
import { useFormik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useSearch } from './hooks/useSearch';

export const SearchBar = ({
  onChange,
  onSubmit,
  options,
}: {
  onChange: Dispatch<SetStateAction<string>>;
  options: string[];
  onSubmit: Dispatch<SetStateAction<string>>;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const ref = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState('');
  const results = useSearch(query);

  useMemo(() => {
    if (results) {
      // eslint-disable-next-line no-console
      console.log('results', results);
      const {
        // @ts-ignore this
        results: { data },
      } = results;
      // @ts-ignore this
      if (data && data.name) {
        // @ts-ignore this
        onChange(data?.name);
      }
    }
  }, [results, onChange]);

  const formik = useFormik({
    initialValues: {
      field1: '',
    },
    onSubmit: (values) => {
      onSubmit(values.field1);
    },
  });

  const select = (option: string) => {
    onSubmit(option);
    setShowOptions(false);
  };

  const handleChange = (text: string) => {
    setQuery(text);
    setCursor(-1);
    if (!showOptions) {
      setShowOptions(true);
    }
  };

  const moveCursorDown = () => {
    if (cursor < options.length - 1) {
      setCursor((c) => c + 1);
    }
  };

  const moveCursorUp = () => {
    if (cursor > 0) {
      setCursor((c) => c - 1);
    }
  };

  const handleNav = (e: { key: any }) => {
    switch (e.key) {
      case 'ArrowUp':
        moveCursorUp();
        break;
      case 'ArrowDown':
        moveCursorDown();
        break;
      case 'Enter':
        if (cursor >= 0 && cursor < options.length) {
          select(options[cursor]);
        }
        break;
    }
  };

  useEffect(() => {
    const listener = (e: { target: any }) => {
      if (ref?.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
        setCursor(-1);
      }
    };

    document.addEventListener('click', listener);
    document.addEventListener('focusin', listener);
    return () => {
      document.removeEventListener('click', listener);
      document.removeEventListener('focusin', listener);
    };
  }, []);

  return (
    <form autoComplete="new-user-street-address" ref={ref} onSubmit={formik.handleSubmit}>
      <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          autoFocus
          autoComplete="do-not-autofill"
          id="field1"
          className="block w-full rounded-lg border border-gray-300 border-transparent bg-gray-50 p-4 pl-10 text-sm text-gray-900 hover:outline-none focus:border-blue-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Search for a verb"
          required
          value={formik.values.field1}
          onChange={(e) => {
            handleChange(e.target.value);
            formik.handleChange(e);
          }}
          onFocus={() => setShowOptions(true)}
          onKeyDown={handleNav}
          name="field1"
        />

        <ul
          className={` absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-400 dark:text-white sm:text-sm ${
            !showOptions && 'hidden'
          } select-none`}
        >
          {options.length > 0 ? (
            options.map((option: string, i: number, arr: string | any[]) => {
              let className = 'px-4 hover:bg-gray-100 dark:hover:bg-gray-100';

              if (i === 0) className += 'pt-2 pb-1 rounded-t-lg';
              else if (i === arr.length) className += 'pt-1 pb-2 rounded-b-lg';
              else if (i === 0 && arr.length === 1) className += 'py-2 rounded-lg';
              else className += 'py-2';

              if (cursor === i) {
                className += ' bg-gray-100';
              }

              return (
                <li
                  className={classNames(
                    `dark:text-white`,
                    'relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900  dark:bg-slate-400 dark:text-white',
                    className,
                  )}
                  key={`option-${i}`}
                  onClick={() => select(option)}
                >
                  {option}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-gray-500 dark:bg-slate-400 dark:text-white ">No results</li>
          )}
        </ul>
      </div>
    </form>
  );
};

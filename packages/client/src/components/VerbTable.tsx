import 'react-tailwind-table/dist/index.css';
import { useEffect, useState } from 'react';
import { trpc } from '../services';
import Table from 'react-tailwind-table';
import { useConjugation } from './hooks/useConjugation';
import Switcher from './Switcher';

export type CheckBoxVals = {
  [checked: string]: boolean;
};

export type Verb = {
  value: {
    [key: string]: Array<string>;
  };
};

export const VerbTable = (props: { verb: string; mood: string; filters: string[] }) => {
  const { verb, mood, filters } = props;
  const { data, isLoading, isError, error } = trpc.useQuery(['verbecc.get', { verb, mood }]);
  const { data: verbData } = trpc.useQuery(['verb.get', { name: 'fazer' }]);

  // eslint-disable-next-line no-console
  console.log('verbdata', verbData);

  const [values, setValues] = useState<CheckBoxVals>({});
  const { rows, columns } = useConjugation({ data, values });

  const handleChange = (event: any) => {
    // set default checked boxes
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.checked,
    }));
  };

  useEffect(() => {
    if (data) {
      // for each filter check or uncheck the box
      const newVals: { [checked: string]: boolean } = {};
      filters.forEach((filt: string) => {
        newVals[filt] = true;
      });
      setValues(newVals);
    }
  }, [filters, data]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );

  if (isError || !data)
    return (
      <div className="mb-4 rounded-lg bg-red-100 py-5 px-6 text-base text-red-700" role="alert">
        Error: {JSON.stringify(error?.message)}
      </div>
    );

  return (
    <>
      <div className="flex justify-center">
        {filters.map((filter) => {
          return (
            <div className="form-check" key={`filter-${filter}`}>
              <label className="form-check-label mr-2 inline-block text-gray-800" htmlFor={filter}>
                <input
                  className="form-check-input float-left mr-2 mt-1 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top leading-tight transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={handleChange}
                  name={filter}
                  checked={values[filter]}
                />
                <span className="text-sm">{filter}</span>
              </label>
            </div>
          );
        })}
      </div>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4  dark:bg-gray-800">
          <ul className="space-y-2">
            <li className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100  hover:text-white dark:text-white dark:hover:bg-gray-700">
              <Switcher />
            </li>
            <li className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100  hover:text-white dark:text-white dark:hover:bg-gray-700">
              <a href="#">
                🇧🇷
                <span className="ml-3 text-gray-500 hover:text-white">Portuguese Verbs</span>
              </a>
            </li>
            <li className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100  hover:text-white dark:text-white ">
              <form>
                <label
                  htmlFor="default-search"
                  className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
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
                    type="search"
                    id="default-search"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700  dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Search for a verb"
                    required
                  />
                </div>
              </form>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
            <Table columns={columns} rows={rows} should_export={false} />
          </div>
        </div>
      </div>
    </>
  );
};

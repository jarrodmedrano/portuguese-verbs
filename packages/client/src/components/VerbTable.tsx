import 'react-tailwind-table/dist/index.css';
import { useEffect, useState, useContext } from 'react';
import { trpc } from '../services';
import Table from 'react-tailwind-table';
import { useConjugation } from './hooks/useConjugation';
import { Switcher } from './Switcher';
import { SearchBar } from './SearchBar';
import { SearchContext, withSearchContext } from '../contexts/SearchContext';
import { Loading } from './Loading';

export type CheckBoxVals = {
  [checked: string]: boolean;
};

export type Verb = {
  value: {
    [key: string]: Array<string>;
  };
};

export type VerbTableProps = {
  verb: string;
  mood: string;
  filters: string[];
};

const VerbTable: React.FC<VerbTableProps> = ({ verb, mood, filters }: VerbTableProps) => {
  const { search, setSearch } = useContext(SearchContext);
  const { data, isLoading, isError, error } = trpc.useQuery(['verbecc.get', { verb: search ? search : verb, mood }]);

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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
      )}

      {(isError || !data) && !isLoading ? (
        <div className="mb-4 rounded-lg bg-red-100 py-5 px-6 text-base text-red-700" role="alert">
          Error: {JSON.stringify(error?.message)}
        </div>
      ) : null}

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
            <li className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:text-white dark:text-white ">
              <SearchBar options={['Chennai', 'Mumbai', 'Bangalore']} value={search} onChange={setSearch} />
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

export const VerbTableWithSearchContext = withSearchContext(VerbTable);

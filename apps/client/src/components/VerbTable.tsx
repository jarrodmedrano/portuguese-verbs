import 'react-tailwind-table/dist/index.css';
import { useEffect, useState, useContext, useCallback } from 'react';
import Table from 'react-tailwind-table';
import { useConjugation } from './hooks/useConjugation';
import { SearchContext, withSearchContext } from '../contexts/SearchContext';
import { Loading } from './Loading';
// import { Sidebar } from './Sidebar';
import classNames from 'classnames';
import { SearchBar } from './SearchBar';
import { getConjugation } from '../../app/api/conjugations/getConjugation';

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
  sidebarIsOpen: boolean;
};

const VerbTable: React.FC<VerbTableProps> = ({ verb, mood, filters, sidebarIsOpen }: VerbTableProps) => {
  const [data, setData] = useState<Verb>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>();
  const { search, partialSearch, setSearch, setPartialSearch } = useContext(SearchContext);
  const [values, setValues] = useState<CheckBoxVals>({});

  const handleGetVerbs: () => Promise<Verb | undefined> = useCallback(async () => {
    try {
      const data = await getConjugation({ verb: search ? search : verb, mood });
      // // eslint-disable-next-line no-console
      if (data) {
        setData(data);
        // for each filter check or uncheck the box
        const newVals: { [checked: string]: boolean } = {};
        filters.forEach((filt: string) => {
          newVals[filt] = true;
        });
        setValues(newVals);
      }
      setIsLoading(isLoading);
      setError(error);
      setIsError(isError);
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error, filters, isError, isLoading, mood, search, verb]);
  useEffect(() => {
    handleGetVerbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { rows, columns } = useConjugation({ data, values });

  const handleChange = (event: any) => {
    // set default checked boxes
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <div className={`dark:bg-gray-700 dark:text-white`}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5 flex justify-center dark:bg-gray-700 dark:text-white">
          {filters.map((filter) => {
            return (
              <div className="form-check" key={`filter-${filter}`}>
                <label className="form-check-label mr-2 inline-block" htmlFor={filter}>
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
        <div className="mb-4 rounded-lg bg-red-100 px-6 py-5 text-base text-red-700" role="alert">
          Error: {JSON.stringify(error?.message)}
        </div>
      ) : null}

      <div className={classNames(`p-4 ${sidebarIsOpen ? 'sm:ml-64' : 'sm:ml-20'}`)}>
        <SearchBar options={[partialSearch]} onChange={setPartialSearch} onSubmit={setSearch} />

        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
            <Table
              columns={columns}
              rows={rows}
              should_export={false}
              styling={{
                top: {
                  elements: {
                    search:
                      'block w-full rounded-sm border border-transparent border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 hover:outline-none focus:border-transparent focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                  },
                },
                table_head: {
                  table_row: 'dark:bg-slate-500 dark:text-white',
                  table_data: 'dark:bg-slate-500 dark:text-white',
                },
                main: 'dark:bg-gray-800 dark:text-white',
                footer: {
                  page_numbers: 'bg-gray-50 dark:bg-gray-800 dark:text-white',
                },
                table_body: {
                  main: 'dark:bg-gray-700 dark:text-white',
                  table_row: 'dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerbTableWithSearchContext = withSearchContext(VerbTable);

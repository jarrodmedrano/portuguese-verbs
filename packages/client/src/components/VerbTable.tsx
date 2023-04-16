import 'react-tailwind-table/dist/index.css';
import { useEffect, useState, useContext } from 'react';
import { trpc } from '../services';
import Table from 'react-tailwind-table';
import { useConjugation } from './hooks/useConjugation';
import { SearchContext, withSearchContext } from '../contexts/SearchContext';
import { Loading } from './Loading';
import { Sidebar } from './Sidebar';
import classNames from 'classnames';

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
  const { search } = useContext(SearchContext);
  // @ts-ignore this
  const { data, isLoading, isError, error } = trpc.useQuery(['verbecc.get', { verb: search ? search : verb, mood }]);
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);

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

  const handleClickSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen);
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
        <div className="mb-4 rounded-lg bg-red-100 py-5 px-6 text-base text-red-700" role="alert">
          Error: {JSON.stringify(error?.message)}
        </div>
      ) : null}

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <Sidebar handleClick={handleClickSidebar} isOpen={sidebarIsOpen} />
      </aside>

      <div className={classNames(`p-4 ${sidebarIsOpen ? 'sm:ml-64' : 'sm:ml-20'}`)}>
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

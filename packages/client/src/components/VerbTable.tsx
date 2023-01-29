import 'react-tailwind-table/dist/index.css';
import { useEffect, useState } from 'react';
import { trpc } from '../services';
import Table from 'react-tailwind-table';
import { useConjugation } from './hooks/useConjugation';

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
      <Table columns={columns} rows={rows} should_export={false} />
    </>
  );
};

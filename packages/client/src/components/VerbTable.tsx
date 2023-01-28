import React, { ReactEventHandler, useEffect, useState } from 'react';
import { client, trpc } from '../services';
import Table, { Icolumn, Irow } from 'react-tailwind-table';
import 'react-tailwind-table/dist/index.css';
import { getConjugation } from 'api/src/verbecc/verbecc.controller';

export const VerbTable = (props: { verb: string; mood: string; filters: string[] }) => {
  const { verb, mood, filters } = props;
  const [rows, setRows] = useState<Irow[]>([]);
  const [columns, setColumns] = useState<Icolumn[]>([]);
  const { data, isLoading, isError, error } = trpc.useQuery(['verbecc.get', { verb, mood }]);

  const [values, setValues] = useState<{ [key: string]: boolean }>({});

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
      const newVals: { [key: string]: boolean } = {};
      filters.forEach((filt: string) => {
        newVals[filt] = true;
      });
      setValues(newVals);
    }
  }, [filters, data]);

  useEffect(() => {
    if (data) {
      // get tenses of the verb and use as table headers
      const colHeaders = Object.keys(data.value);

      // transform data for use in tailwind table column
      const cols = colHeaders.filter((col) => values[col]).map((col) => ({ field: col, use: col }));

      // get array of length of the conjugations]
      // @ts-ignore this is a nonsense error
      const headerMap: Array<string> = data.value[colHeaders[0]];

      console.log('headermap', headerMap);

      // transform data for use in tailwind table row
      const myRows = headerMap.map((_, index: number) => {
        return colHeaders
          .map((colHeader, _) => {
            return {
              [colHeader]: data.value[colHeader][index],
            };
          })
          .reduce((prev, curr) => {
            return {
              ...prev,
              ...curr,
            };
          });
      });
      setColumns(cols);
      // // hide tu and vos
      setRows(myRows);
    }
  }, [verb, mood, filters, values, data]);

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
              <input
                className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                type="checkbox"
                id="flexCheckDefault"
                onChange={handleChange}
                name={filter}
                checked={values[filter]}
              />
              <label className="form-check-label inline-block text-gray-800" htmlFor={filter}>
                {filter}
              </label>
            </div>
          );
        })}
      </div>
      <Table columns={columns} rows={rows} should_export={false} />;
    </>
  );
};

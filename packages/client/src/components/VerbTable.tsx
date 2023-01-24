import React, { useEffect, useState } from 'react';
import { trpc } from '../services';
import Table, { Icolumn, Irow } from 'react-tailwind-table';
import 'react-tailwind-table/dist/index.css';

export const VerbTable = () => {
  // const { data, isLoading, isError, error } = trpc.useQuery(['verbecc.get']);
  const [data, setData] = useState('');
  const [indicitavo, setIndicitavo] = useState('');
  const [rows, setRows] = useState<Irow[]>([]);
  const [columns, setColumns] = useState<Icolumn[]>([]);
  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
      const response = await fetch('http://localhost:8000/conjugate/pt/fazer?mood=indicativo');
      const data = await response.json();
      const colHeaders = Object.keys(data.value);
      const cols = colHeaders.map((col) => ({ field: col, use: col }));

      const headerMap = data.value[colHeaders[0]];

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
      setRows(myRows);
      setData(data);
    };

    fetchData();
  }, []);

  return <Table columns={columns} rows={rows} />;
};

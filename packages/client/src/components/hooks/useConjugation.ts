import { CheckBoxVals, Verb } from '../VerbTable';

export const useConjugation = ({
  data,
  values,
}: {
  data: Verb | undefined;
  values: CheckBoxVals;
}): {
  columns: {
    field: string;
    use: string;
  }[];
  rows: { [x: string]: string | undefined }[];
} => {
  // get tenses of the verb and use as table headers
  const colHeaders = data ? Object.keys(data.value) : [];
  // transform data for use in tailwind table column
  const cols = colHeaders ? colHeaders.filter((col) => values[col]).map((col) => ({ field: col, use: col })) : [];

  // get array of length of the conjugations]
  // @ts-ignore this is a nonsense error
  const headerMap: Array<string> = data ? data.value[colHeaders[0]] : [];

  // transform data for use in tailwind table row
  const myRows = headerMap
    .map((_, index: number) => {
      return colHeaders
        .map((colHeader) => {
          return {
            [colHeader]: data?.value[colHeader][index],
          };
        })
        .reduce((prev, curr) => {
          return {
            ...prev,
            ...curr,
          };
        });
    })
    .map((row, index) => {
      return {
        pronoun:
          index === 0
            ? 'eu'
            : index === 1
            ? 'tu'
            : index === 2
            ? 'ele/ela'
            : index === 3
            ? 'nós'
            : index === 4
            ? 'vós'
            : 'eles/elas',
        ...row,
      };
    });

  return {
    columns: [
      {
        field: 'pronoun',
        use: 'pronoun',
      },
      ...cols,
    ],
    rows: myRows,
  };
};

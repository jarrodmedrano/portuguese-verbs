import { CheckBoxVals, Verb } from '../VerbTable';

const filterVosAndTu = (verb: string) => {
  return !verb.includes('vós') && !verb.includes('tu');
};
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
  const headerMap: Array<string> = data ? data.value[colHeaders[0]].filter(filterVosAndTu) : [];

  // transform data for use in tailwind table row
  const myRows = headerMap
    .map((_, index: number) => {
      return colHeaders
        .map((colHeader) => {
          const filteredvalues = data?.value[colHeader].filter(filterVosAndTu);
          return {
            [colHeader]: filteredvalues?.[index],
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
            ? 'ele/ela/voce'
            : index === 2
            ? 'nós'
            : index === 3
            ? 'eles/elas/voces'
            : '',
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

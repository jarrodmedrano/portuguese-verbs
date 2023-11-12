import { useContext, useEffect, useState } from 'react';
import { Switcher } from './Switcher';
import Link from 'next/link';
import { Checkboxes } from './Quiz/Checkboxes';
import { ChangeEvent } from 'react';
import { trpc } from '../services';
import { AppContext } from '../contexts/AppContext';
import { isArrayWithLength } from '../../utils/typeguards';
import { Spinner } from './Spinner';
import { z } from 'zod';

const questionType = z.array(
  z.object({
    tense: z.string().optional().or(z.array(z.string()).optional()),
    regularity: z.string().optional().or(z.array(z.string()).optional()),
    verbType: z.string().optional().or(z.array(z.string()).optional()),
    preferredLanguage: z.string().optional(),
    language: z.string().optional(),
    difficulty: z.string().optional(),
    text: z.string(),
    translation: z.string(),
    answers: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        isCorrect: z.boolean(),
      }),
    ),
  }),
);
export const Sidebar = ({ handleClick, isOpen }: { handleClick: () => void; isOpen: boolean }) => {
  const { setQuizQuestions, quizQuestions, setIsLoading, isLoading } = useContext(AppContext);

  const [isOpenClass, setIsOpenClass] = useState('justify-center');
  // const { partialSearch, setPartialSearch, setSearch } = useContext(SearchContext);
  const [query, setQuery] = useState<{
    tense?: string | string[];
    regularity?: string | string[];
    verbType?: string | string[];
    preferredLanguage?: string;
    language?: string;
    difficulty?: string;
  }>({
    tense: 'any',
    regularity: 'any',
    verbType: 'any',
    preferredLanguage: 'en-us',
    language: 'pt-br',
    difficulty: 'A1',
  });

  const { data } = trpc.questions.useQuery({
    language: 'pt-br',
    ...query,
  });

  const switchHandler = (event: ChangeEvent<HTMLInputElement>, queryParam: 'verbType' | 'regularity' | 'tense') => {
    const newQuery: {
      verbType?: string[] | string;
      regularity?: string[] | string;
      tense?: string[] | string;
    } = { ...query };

    if (event.target.checked) {
      if (newQuery?.[queryParam] && Array.isArray(newQuery[queryParam])) {
        newQuery[queryParam] = [...(newQuery[queryParam] as string[]), event.target.value];
      } else if (newQuery?.[queryParam]) {
        newQuery[queryParam] = [newQuery[queryParam] as string, event.target.value];
      } else {
        newQuery[queryParam] = [event.target.value];
      }
    } else {
      if (Array.isArray(newQuery[queryParam]) && isArrayWithLength(newQuery?.[queryParam]?.length)) {
        newQuery[queryParam] = (newQuery[queryParam] as string[])?.filter(
          (item: string) => item !== event.target.value,
        );
      } else if (newQuery[queryParam]) {
        delete newQuery[queryParam];
      }
    }
    setQuery(newQuery);
  };

  const handleCheckboxSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'ar' || event.target.value === 'ir' || event.target.value === 'er') {
      switchHandler(event, 'verbType');
    } else if (event.target.value === 'regular' || event.target.value === 'irregular') {
      switchHandler(event, 'regularity');
    } else if (
      event.target.value === 'presente' ||
      event.target.value === 'preterito-perfeito' ||
      event.target.value === 'preterito-imperfeito' ||
      event.target.value === 'futuro-do-presente' ||
      event.target.value === 'presente-progressivo' ||
      event.target.value === 'futuro-do-preterito'
    ) {
      switchHandler(event, 'tense');
    }
  };

  useEffect(() => {
    if (data) {
      setQuizQuestions(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!isOpen) {
      setIsOpenClass('justify-center');
    } else {
      setIsOpenClass('w-full px-3');
    }
  }, [isOpen]);

  const handleShuffle = () => {
    setIsLoading(true);
    const shuffled = [...quizQuestions];
    for (let i = quizQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuizQuestions(shuffled);
    setIsLoading(false);
  };

  function findFirstArrayInString(str: string, index = 0, firstArrayStart = -1, bracketsCount = 0): string {
    // Base case: if we've reached the end of the string, return null
    if (index === str.length) {
      return '';
    }

    // Current character in the string
    const char = str[index];

    // If we encounter an opening bracket, we need to increase our count
    if (char === '[') {
      bracketsCount++;
      // If it's the first opening bracket we've found, mark its position
      if (firstArrayStart === -1) {
        firstArrayStart = index;
      }
    }
    // If we encounter a closing bracket, we decrease our count
    else if (char === ']') {
      bracketsCount--;
      // If our count is back to zero, we've found the end of the first complete array
      if (bracketsCount === 0 && firstArrayStart !== -1) {
        return str.substring(firstArrayStart, index + 1);
      }
    }

    // Move to the next character in the string
    return findFirstArrayInString(str, index + 1, firstArrayStart, bracketsCount);
  }
  const mutation = trpc.aiQuestion.mutate.useMutation({
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log('success', data);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    },
  });

  const stringifyArrays = (value: any) => {
    if (typeof value !== 'object') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    }
  };

  const handleGetMore = async () => {
    setIsLoading(true);
    try {
      const { difficulty, tense, verbType, regularity, language, preferredLanguage } = query;

      const result = await mutation.mutateAsync({
        tense,
        regularity,
        verbType,
        difficulty: difficulty || 'A1',
        language: language || 'pt-br',
        preferredLanguage: 'en-us',
        messages: [
          {
            role: 'assistant',
            content: JSON.stringify(quizQuestions[0]),
          },
          {
            role: 'user',
            content: `Write 10 sentence(s) in ${language} of ${difficulty || 'A1'} that have a missing verb of ${
              verbType ? stringifyArrays(verbType) : 'any'
            } type in ${regularity ? stringifyArrays(regularity) : 'any'} form and in ${
              tense ? stringifyArrays(tense) : 'any'
            } tense. Also include the answers to guess from. include a translation for ${
              preferredLanguage ?? 'en-us'
            }. The translation SHOULD include the verb, not a blank space. the answer should be the same verb but in different conjugations. Do not include tu or vos form. Do not include the mais que perfecto form. Do not repeat questions. The questions should be an array of objects in this format but randomize the questions don't take this example literally: {${JSON.stringify(
              [
                {
                  tense: query?.tense,
                  regularity: query?.regularity,
                  verbType: query?.verbType,
                  text: 'Eu ______ café todas as manhãs.',
                  translation: 'I drink coffee every morning.',
                  answers: [
                    { id: 'a1', text: 'bebo', isCorrect: true },
                    { id: 'a2', text: 'bebe', isCorrect: false },
                    { id: 'a3', text: 'bebemos', isCorrect: false },
                    { id: 'a4', text: 'bebem', isCorrect: false },
                  ],
                },
              ],
            )}}`,
          },
        ],
      });

      // eslint-disable-next-line no-console
      console.log('result', result);
      // @ts-ignore this line
      const content = result?.choices[0].message.content;
      // eslint-disable-next-line no-console
      console.log('content', content);
      let initialStr = '';
      if (content[0] === '[') {
        initialStr = content;
      } else if (content[0] === '{') {
        initialStr = `[${content}]`;
      } else {
        initialStr = findFirstArrayInString(content);
      }
      // eslint-disable-next-line no-console
      console.log('inti str', initialStr);
      const dataJSON = JSON.parse(initialStr);
      const parsedQuestion = questionType.safeParse(dataJSON);
      // eslint-disable-next-line no-console
      console.log('parsed', parsedQuestion);
      if (parsedQuestion.success) {
        // // setNewQuestions([...newQuestions, ...dataJSON]);
        setQuizQuestions([...dataJSON, ...quizQuestions]);
      }
      setIsLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('err', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex h-full flex-col items-center overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 shadow-lg' : 'w-16'
      }`}
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-2 py-2 dark:bg-gray-800">
        <ul className="space-y-1">
          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <a
              className="flex h-10 w-full items-center justify-center hover:text-gray-300"
              href="#"
              onClick={handleClick}
            >
              <svg
                className="mr-2 h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              {isOpen && (
                <span>
                  <span className="text-md h-10 w-10">🇧🇷</span> Portuguese Verbs
                </span>
              )}
            </a>
          </li>

          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <Switcher showLabel={isOpen} />
          </li>
        </ul>
        {isOpen && (
          <ul className="space-y-1">
            <li
              className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
            >
              <Link
                className="flex h-10 w-full items-center justify-start hover:text-gray-300"
                href="/#"
                onClick={handleClick}
              >
                Home
              </Link>
            </li>

            <li
              className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
            >
              <Link
                className="flex h-10 w-full items-center justify-start hover:text-gray-300"
                href="/verbs"
                onClick={handleClick}
              >
                Table of Verbs
              </Link>
            </li>

            {/* <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            {!isOpen ? (
              <a
                className="flex h-10 w-10 items-center justify-center hover:text-gray-300"
                href="#"
                onClick={handleClick}
              >
                <svg
                  className="h-5 w-5 stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </a>
            ) : (
              <div></div>
              // <SearchBar options={[partialSearch]} onChange={setPartialSearch} onSubmit={setSearch} />
            )}
          </li> */}
          </ul>
        )}

        {isOpen && (
          <button
            onClick={handleGetMore}
            className="me-2 mb-5 inline-flex w-full items-center items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading && <Spinner size="sm" />}
            {isLoading ? 'Loading...' : 'Get More Questions'}
          </button>
        )}
        {isOpen && (
          <button
            onClick={handleShuffle}
            className="me-2 mb-5 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Shuffle
          </button>
        )}
        {isOpen && <Checkboxes isOpen={isOpen} handleCheckbox={handleCheckboxSelect} />}
      </div>
    </div>
  );
};

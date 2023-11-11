import { useContext, useEffect, useState } from 'react';
import { Switcher } from './Switcher';
import Link from 'next/link';
import { Checkboxes } from './Quiz/Checkboxes';
import { ChangeEvent } from 'react';
import { trpc } from '../services';
import { AppContext } from '../contexts/AppContext';
import { isArrayWithLength } from '../../utils/typeguards';
export const Sidebar = ({ handleClick, isOpen }: { handleClick: () => void; isOpen: boolean }) => {
  const { setQuizQuestions, quizQuestions, setIsLoading } = useContext(AppContext);

  const [isOpenClass, setIsOpenClass] = useState('justify-center');
  // const { partialSearch, setPartialSearch, setSearch } = useContext(SearchContext);
  const [query, setQuery] = useState<{
    tense?: string | string[];
    regularity?: string | string[];
    verbType?: string | string[];
    preferredLanguage?: string;
    language?: string;
    difficulty?: string;
  }>({});

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

  // function findFirstArrayInString(str: string, index = 0, firstArrayStart = -1, bracketsCount = 0): string {
  //   // Base case: if we've reached the end of the string, return null
  //   if (index === str.length) {
  //     return '';
  //   }

  //   // Current character in the string
  //   const char = str[index];

  //   // If we encounter an opening bracket, we need to increase our count
  //   if (char === '[') {
  //     bracketsCount++;
  //     // If it's the first opening bracket we've found, mark its position
  //     if (firstArrayStart === -1) {
  //       firstArrayStart = index;
  //     }
  //   }
  //   // If we encounter a closing bracket, we decrease our count
  //   else if (char === ']') {
  //     bracketsCount--;
  //     // If our count is back to zero, we've found the end of the first complete array
  //     if (bracketsCount === 0 && firstArrayStart !== -1) {
  //       return str.substring(firstArrayStart, index + 1);
  //     }
  //   }

  //   // Move to the next character in the string
  //   return findFirstArrayInString(str, index + 1, firstArrayStart, bracketsCount);
  // }
  const mutation = trpc.aiQuestion.mutate.useMutation();

  const handleGetMore = async () => {
    try {
      const result = await mutation.mutateAsync({
        tense: query?.tense,
        regularity: query?.regularity,
        verbType: query?.verbType,
        difficulty: query?.difficulty || '1',
        language: 'pt-br',
        preferredLanguage: 'en-us',
        messages: [
          {
            role: 'assistant',
            content: JSON.stringify(quizQuestions),
          },
          {
            role: 'user',
            content: 'Write three more questions.',
          },
        ],
      });

      // eslint-disable-next-line no-console
      console.log('result', result);
      // // eslint-disable-next-line no-console
      // console.log('result', result);
      // const { data: openAiData } = result;
      // // @ts-ignore this line
      // const content = openAiData?.choices[0].message.content;
      // // eslint-disable-next-line no-console
      // console.log('content', content);
      // let initialStr = '';
      // if (content[0] === '[') {
      //   initialStr = content;
      // } else if (content[0] === '{') {
      //   initialStr = `[${content}]`;
      // } else {
      //   initialStr = findFirstArrayInString(content);
      // }
      // // eslint-disable-next-line no-console
      // console.log('inti str', initialStr);
      // const dataJSON = JSON.parse(initialStr);
      // // setNewQuestions([...newQuestions, ...dataJSON]);
      // setQuizQuestions([...dataJSON, ...quizQuestions]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('err', error);
    }

    // try {
    //   const result = trpc.aiQuestion.get.useQuery({
    //     tense: query?.tense,
    //     regularity: query?.regularity,
    //     verbType: query?.verbType,
    //     difficulty: query?.difficulty || '1',
    //     language: 'pt-br',
    //     preferredLanguage: 'en-us',
    //     messages: [
    //       {
    //         role: 'assistant',
    //         content: JSON.stringify(quizQuestions),
    //       },
    //       {
    //         role: 'user',
    //         content: 'Write three more questions.',
    //       },
    //     ],
    //   });
    //   // eslint-disable-next-line no-console
    //   console.log('result', result);
    //   const { data: openAiData } = result;
    //   // @ts-ignore this line
    //   const content = openAiData?.choices[0].message.content;
    //   // eslint-disable-next-line no-console
    //   console.log('content', content);
    //   let initialStr = '';
    //   if (content[0] === '[') {
    //     initialStr = content;
    //   } else if (content[0] === '{') {
    //     initialStr = `[${content}]`;
    //   } else {
    //     initialStr = findFirstArrayInString(content);
    //   }
    //   // eslint-disable-next-line no-console
    //   console.log('inti str', initialStr);
    //   const dataJSON = JSON.parse(initialStr);
    //   // setNewQuestions([...newQuestions, ...dataJSON]);
    //   setQuizQuestions([...dataJSON, ...quizQuestions]);
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.log('err', error);
    // }
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
        <button
          onClick={handleGetMore}
          className="me-2 mb-5 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Get More Questions
        </button>
        <button
          onClick={handleShuffle}
          className="me-2 mb-5 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Shuffle
        </button>
        <Checkboxes isOpen={isOpen} handleCheckbox={handleCheckboxSelect} />
      </div>
    </div>
  );
};

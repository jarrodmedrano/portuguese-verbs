import { useCallback, useContext, useEffect, useState } from 'react';
import { Switcher } from './Switcher';
import Link from 'next/link';
import { Checkboxes } from './Quiz/Checkboxes';
import { ChangeEvent } from 'react';
import { AppContext } from '../contexts/AppContext';
import { isArrayWithLength } from '../../utils/typeguards';
import { Spinner } from './Spinner';
import { z } from 'zod';
import { Question } from './Quiz/QuizApp';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAiQuestions } from '../../app/api/openai/getAiQuestions';
import { getQuestions } from '../../app/api/questions/getQuestions';
import { postQuestions } from '../../app/api/questions/postQuestions';

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
  const { user } = useUser();
  const { setQuizQuestions, quizQuestions, setIsLoading, isLoadingButton, setIsLoadingButton } = useContext(AppContext);

  const [isOpenClass, setIsOpenClass] = useState('justify-center');
  // const { partialSearch, setPartialSearch, setSearch } = useContext(SearchContext);
  const [query, setQuery] = useState<{
    tense?: string | string[];
    regularity?: string | string[];
    verbType?: string | string[];
    preferredLanguage?: string;
    language?: string;
    difficulty?: string;
    source?: string;
  }>({});

  const handleGetQuestions: () => Promise<Question[]> = useCallback(async () => {
    const result = await getQuestions({
      language: 'pt-br',
      ...query,
    });
    const data = result[0].result.data;
    setQuizQuestions(data);
    return data;
  }, [query, setQuizQuestions]);

  useEffect(() => {
    if (query) {
      handleGetQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const switchHandler = (event: ChangeEvent<HTMLInputElement>, queryParam: 'verbType' | 'regularity' | 'tense') => {
    const newQuery: {
      verbType?: string[] | string;
      regularity?: string[] | string;
      tense?: string[] | string;
      source?: string;
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

  const handleGetAiQuestions = useCallback(async ({ ...args }) => {
    try {
      const data = await getAiQuestions({ ...args });

      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const addAiQuestions = useCallback(async (args: Question[]) => {
    // eslint-disable-next-line no-console
    console.log('args', args);
    try {
      const res = await postQuestions(args);
      // eslint-disable-next-line no-console
      console.log('res', res);
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const stringifyArrays = (value: any) => {
    if (typeof value !== 'object' && typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    }
  };

  const handleGetMore = async () => {
    setIsLoadingButton(true);
    try {
      const { difficulty, tense, verbType, regularity, language, preferredLanguage } = query;

      const result = await handleGetAiQuestions({
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
            }. The translation SHOULD include the verb, not a blank space. the answer should be the same verb but in different conjugations. Do not include tu or vos form. Do not include the mais que perfecto form. Do not repeat questions. Answer text should be unique and not repeat. Make sure the JSON output is valid JSON. Only one answer can be correct. The questions should be an array of objects in this format but randomize the questions don't take this example literally: {${JSON.stringify(
              [
                {
                  tense: query?.tense || 'presente',
                  regularity: query?.regularity || 'regular',
                  verbType: query?.verbType || 'ar',
                  difficulty: query?.difficulty || 'A1',
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
      const content = result?.[0]?.result?.data?.choices?.[0]?.message?.content;
      // const content = result?.choices[0].message.content;
      // eslint-disable-next-line no-console
      console.log('content', content);
      const dataJSON = JSON.parse(content);
      const parsedQuestion = questionType.safeParse(dataJSON);
      // eslint-disable-next-line no-console
      console.log('parsed', parsedQuestion);
      if (parsedQuestion.success) {
        setIsLoading(true);
        // // setNewQuestions([...newQuestions, ...dataJSON]);
        // setQuizQuestions([...dataJSON, ...quizQuestions]);
        const newQuestions: Question[] = dataJSON.map((question: Question) => ({
          ...question,
          language: 'pt-br',
          answers: JSON.stringify(question.answers),
          src: 'generated',
        }));
        addAiQuestions(newQuestions);
        setIsLoading(false);
      }
      setIsLoadingButton(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('err', error);
      setIsLoadingButton(false);
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out md:h-full md:items-center ${
        isOpen ? 'shadow-lg md:w-64' : 'md:w-16'
      }`}
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-2 py-2 dark:bg-gray-800">
        <ul className="space-y-1">
          <li
            className={`flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
          >
            <a
              className="pointer-events-auto flex h-10 w-full items-center justify-center hover:text-gray-300"
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
            className={`pointer-events-auto flex items-center rounded-lg p-1 text-sm font-medium text-gray-900 hover:bg-gray-700 dark:text-white ${isOpenClass}`}
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
              {!user ? (
                <a className="flex h-10 w-full items-center justify-start hover:text-gray-300" href="/api/auth/login">
                  Login
                </a>
              ) : (
                <a className="flex h-10 w-full items-center justify-start hover:text-gray-300" href="/api/auth/logout">
                  Logout
                </a>
              )}
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
          </ul>
        )}

        {isOpen && user && user.email === 'jmedran@gmail.com' && (
          <button
            onClick={handleGetMore}
            disabled={isLoadingButton}
            className="me-2 mb-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoadingButton && <Spinner size="sm" />}
            {isLoadingButton ? 'Loading...' : 'Get More Questions'}
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
        {isOpen && (
          <div className="size-sm fixed inset-x-0 bottom-0 m-2 justify-center text-center text-sm ">
            Copyright{' '}
            <Link href="https://jarrodmedrano.com" target="_blank">
              Jarrod Medrano
            </Link>{' '}
            &copy; {new Date().getFullYear()}
          </div>
        )}
      </div>
    </div>
  );
};

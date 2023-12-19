import React, { useContext, useEffect, useCallback } from 'react';
import Quiz from './Quiz';
import { AppContext } from '../../contexts/AppContext';
import { Spinner } from '../Spinner';
import { getQuestions } from '../../../app/api/questions/getQuestions';

export interface Question {
  text: string;
  translation: string;
  answers: string;
  tense: string;
  regularity: string;
  verbType: string;
  difficulty: string;
  likes: number;
  dislikes: number;
  preferredLanguage: string;
  language: string;
  orderBy: [
    {
      [key: string]: 'asc' | 'desc';
    },
  ];
  src: string;
}

const QuizApp = () => {
  const { isLoading, setQuizQuestions, quizQuestions } = useContext(AppContext);
  const handleGetQuestions: () => Promise<Question[]> = useCallback(async () => {
    const result = await getQuestions({
      language: 'pt-br',
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });
    const data = result?.[0]?.result?.data;
    setQuizQuestions(data);
    return data;
  }, [setQuizQuestions]);
  useEffect(() => {
    handleGetQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="flex h-screen ">
        <div className="m-auto w-full max-w-md rounded border px-10 py-10 text-center  dark:bg-gray-800 dark:text-white">
          <h1 className="text-3xl font-bold">Conjugame</h1>

          {isLoading ? (
            <>
              <div className="m-10 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
              Please be patient...
            </>
          ) : (
            <Quiz questions={quizQuestions} />
          )}
        </div>
      </div>
    </>
  );
};

export default QuizApp;

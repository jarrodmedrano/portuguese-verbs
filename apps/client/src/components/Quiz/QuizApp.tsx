import React, { useContext, useEffect } from 'react';
import Quiz from './Quiz';
import { AppContext } from '../../contexts/AppContext';
import { trpc } from '../../services';
import { Spinner } from '../Spinner';

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
}

const QuizApp = () => {
  const { isLoading, setQuizQuestions, quizQuestions } = useContext(AppContext);
  const { data } = trpc.questions.useQuery({
    language: 'pt-br',
  });

  useEffect(() => {
    if (data) {
      setQuizQuestions(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
              Please be patient as Open AI is slow...
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

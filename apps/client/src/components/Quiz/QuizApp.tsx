import React, { useContext } from 'react';
import Quiz, { Answer } from './Quiz';
import Loader from './Loader';
import { AppContext } from '../../contexts/AppContext';
import { trpc } from '../../services';

export interface Question {
  text: string;
  translation: string;
  answers: Answer[];
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
  const { isLoading } = useContext(AppContext);
  const { data } = trpc.questions.useQuery({
    preferredLanguage: 'en-us',
    language: 'pt-br',
  });

  return (
    <>
      <div className="flex h-screen ">
        <div className="m-auto w-full max-w-md rounded border px-10 py-10 text-center  dark:bg-gray-800 dark:text-white">
          <h1 className="text-3xl font-bold">Conjugame</h1>
          {isLoading ? <Loader /> : <Quiz questions={data} />}
        </div>
      </div>
    </>
  );
};

export default QuizApp;

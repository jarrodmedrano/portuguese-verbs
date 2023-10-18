import React, { useContext } from 'react';
import Quiz, { Answer } from './Quiz';
import Loader from './Loader';
import { AppContext } from '../../contexts/AppContext';

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
  const { quizQuestions, isLoading } = useContext(AppContext);

  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto w-full max-w-md rounded border px-10 py-10 text-center">
          <h1 className="text-3xl font-bold underline">PortuQuiz</h1>
          {isLoading ? <Loader /> : <Quiz questions={quizQuestions} />}
        </div>
      </div>
    </>
  );
};

export default QuizApp;

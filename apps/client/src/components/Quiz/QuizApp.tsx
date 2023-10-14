import React, { useEffect, useState } from 'react';
import Quiz, { Answer } from './Quiz';
import Navbar from './Navbar';
import questionsJSON from './questions.json';
import Loader from './Loader';

export interface Question {
  text: string;
  translation: string;
  answers: Answer[];
  tense: string;
  regularity: string;
  verbType: string;
}

function QuizApp() {
  const defaultQuestions: Question[] = questionsJSON.questions as Question[];
  const [quizQuestions, setQuizQuestions] = useState<Question[]>(defaultQuestions);
  const [isLoading, setIsLoading] = useState(false);

  const handleShuffle = () => {
    setIsLoading(true);
    const shuffled = [...defaultQuestions];
    for (let i = defaultQuestions.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuizQuestions(shuffled);
    setIsLoading(false);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setIsLoading(true);

    switch (value) {
      case undefined:
        handleShuffle();
        break;
      case 'shuffle':
        handleShuffle();
        break;
      case 'ar':
        const arQuestions = defaultQuestions.filter((q) => q.verbType === 'ar');
        setQuizQuestions(arQuestions);
        break;
      case 'ir':
        const irQuestions = defaultQuestions.filter((q) => q.verbType === 'ir');
        setQuizQuestions(irQuestions);
        break;
      case 'er':
        const erQuestions = defaultQuestions.filter((q) => q.verbType === 'er');
        setQuizQuestions(erQuestions);
        break;
      case 'presente':
        const presenteQuestions = defaultQuestions.filter((q) => q.tense === 'presente');
        setQuizQuestions(presenteQuestions);
        break;
      case 'preterito-perfeito':
        const ppQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-perfeito');
        setQuizQuestions(ppQuestions);
        break;
      case 'perfeito':
        const pQuestions = defaultQuestions.filter((q) => q.tense === 'perfeito');
        setQuizQuestions(pQuestions);
        break;
      case 'futuro-do-presente':
        const fpQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-presente');
        setQuizQuestions(fpQuestions);
        break;
      case 'preterito-imperfeito':
        const piQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-imperfeito');
        setQuizQuestions(piQuestions);
        break;
      case 'regular':
        const regQuestions = defaultQuestions.filter((q) => q.regularity === 'regular');
        setQuizQuestions(regQuestions);
        break;
      case 'irregular':
        const irregQuestions = defaultQuestions.filter((q) => q.regularity === 'irregular');
        setQuizQuestions(irregQuestions);
        break;
      case 'preterito-mais-que-perfeito':
        const fpDQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-mais-que-perfeito');
        setQuizQuestions(fpDQuestions);
        break;
      case 'futuro-do-imperfeito':
        const fpIQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-imperfeito');
        setQuizQuestions(fpIQuestions);
        break;
      case 'presente-progressivo':
        const ppPQuestions = defaultQuestions.filter((q) => q.tense === 'presente-progressivo');
        setQuizQuestions(ppPQuestions);
        break;
      case 'futuro-do-preterito':
        const fpPQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-preterito');
        setQuizQuestions(fpPQuestions);
        break;
      default:
        setQuizQuestions(defaultQuestions);
        break;
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [quizQuestions, isLoading]);

  return (
    <>
      <Navbar handleClick={handleNavClick} />
      <div className="flex h-screen">
        <div className="m-auto w-full max-w-md rounded border px-10 py-10 text-center">
          <h1 className="text-3xl font-bold underline">PortuQuiz</h1>
          {isLoading ? <Loader /> : <Quiz questions={quizQuestions} />}
        </div>
      </div>
    </>
  );
}

export default QuizApp;

import { useEffect, useState } from 'react';
import { Question } from './QuizApp';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  tense: string;
}

const Quiz = ({ questions }: { questions?: Question[] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(questions?.[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [shuffledAnswers, setShuffled] = useState<Answer[]>([]);
  const [lastQuestion, setLastQuestion] = useState(false);
  const [formattedAnswers, setFormattedAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (currentQuestion && questions && questions.length) {
      setLastQuestion(currentIndex === questions?.length - 1);
    }
  }, [currentIndex, currentQuestion, questions]);

  function handleAnswerClick(answer: Answer) {
    setSelectedAnswer(answer);
  }

  function handleNextClick() {
    setSelectedAnswer(null);
    setCurrentIndex(currentIndex + 1);
  }

  function handlePrevClick() {
    setSelectedAnswer(null);
    setCurrentIndex(currentIndex - 1);
  }

  useEffect(() => {
    setCurrentQuestion(questions?.[currentIndex]);
  }, [currentIndex, questions]);

  useEffect(() => {
    if (currentQuestion) {
      const a =
        typeof currentQuestion.answers === 'string' ? JSON.parse(currentQuestion.answers) : currentQuestion.answers;
      setFormattedAnswers(a);
      const answers = a;
      const shuffled = [...answers];
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffled(shuffled);
    }
  }, [currentQuestion]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [questions]);

  return (
    <div className="rounded-md bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-white">
      {currentQuestion && (
        <div className="mb-4 flex items-center justify-center">
          <span>
            {currentQuestion.tense}, {currentQuestion.regularity}, {currentQuestion.verbType} verb
          </span>
        </div>
      )}

      <div className="mb-4 mt-4 text-xl font-bold">{currentQuestion?.text}</div>
      <div className="mb-4 mt-4 text-sm">{currentQuestion?.translation}</div>
      <div className="space-y-4">
        {shuffledAnswers.map((answer: Answer) => (
          <button
            key={answer.id}
            className={`w-full rounded-md border px-4 py-2 text-gray-900 transition dark:text-white 
          ${
            selectedAnswer?.id === answer.id && answer.isCorrect
              ? 'border-green-500 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : selectedAnswer?.id === answer.id
              ? 'border-red-500 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              : 'border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
            onClick={() => handleAnswerClick(answer)}
          >
            {answer.text}
          </button>
        ))}

        <footer className="mt-6">
          <div className="flex justify-between">
            {currentIndex !== 0 && (
              <button
                className="mr-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                onClick={handlePrevClick}
              >
                Previous Question
              </button>
            )}
            <button
              className={`rounded  px-4 py-2 focus:outline-none ${
                !selectedAnswer ||
                !formattedAnswers.find((a) => a.id === selectedAnswer?.id && a.isCorrect) ||
                lastQuestion
                  ? 'bg-gray-50 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={handleNextClick}
              disabled={
                !selectedAnswer ||
                !formattedAnswers.find((a) => a.id === selectedAnswer?.id && a.isCorrect) ||
                lastQuestion
              }
            >
              Next Question
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Quiz;

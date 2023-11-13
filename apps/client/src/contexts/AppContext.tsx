import React, { useState } from 'react';
import { Question } from '../components/Quiz/QuizApp';
// import questionsJSON from '../components/Quiz/questions.json';

interface AppContextProps {
  sidebarIsOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSidebarIsOpen: (isOpen: boolean) => void;
  quizQuestions: Question[];
  // eslint-disable-next-line no-unused-vars
  setQuizQuestions: (questions: Question[]) => void;
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsLoading: (isLoading: boolean) => void;
}

export const AppContext = React.createContext<AppContextProps>({
  sidebarIsOpen: false,
  setSidebarIsOpen: () => false,
  quizQuestions: [],
  setQuizQuestions: () => [],
  isLoading: false,
  setIsLoading: () => false,
});

export const AppContextProvider = ({ children }: { children: any }) => {
  // const defaultQuestions: Question[] = questionsJSON.questions as Question[];
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{ sidebarIsOpen, setSidebarIsOpen, quizQuestions, setQuizQuestions, isLoading, setIsLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const withAppContext = (Component: React.FC<any>) => {
  const AppContextConsumer = (props: any) => {
    return <AppContext.Consumer>{(context) => <Component {...props} {...context} />}</AppContext.Consumer>;
  };

  return AppContextConsumer;
};

import React, { useState } from 'react';
import { Question } from '../components/Quiz/QuizApp';
// import questionsJSON from '../components/Quiz/questions.json';

interface AppContextProps {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: (isOpen: boolean) => void;
  quizQuestions: Question[];
  setQuizQuestions: (questions: Question[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isLoadingButton: boolean;
  setIsLoadingButton: (isLoadingButton: boolean) => void;
  setSearchQuery: (query: any) => void;
  searchQuery: {
    tense?: string | string[];
    regularity?: string | string[];
    verbType?: string | string[];
    preferredLanguage?: string;
    language?: string;
    difficulty?: string;
    source?: string;
  };
}

export const AppContext = React.createContext<AppContextProps>({
  sidebarIsOpen: false,
  setSidebarIsOpen: () => false,
  quizQuestions: [],
  setQuizQuestions: () => [],
  isLoading: false,
  setIsLoading: () => false,
  setIsLoadingButton: () => false,
  isLoadingButton: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearchQuery: () => {},
  searchQuery: {},
});

export const AppContextProvider = ({ children }: { children: any }) => {
  // const defaultQuestions: Question[] = questionsJSON.questions as Question[];
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{
    tense?: string | string[];
    regularity?: string | string[];
    verbType?: string | string[];
    preferredLanguage?: string;
    language?: string;
    difficulty?: string;
    source?: string;
  }>({});

  return (
    <AppContext.Provider
      value={{
        sidebarIsOpen,
        setSidebarIsOpen,
        quizQuestions,
        setQuizQuestions,
        isLoading,
        setIsLoading,
        isLoadingButton,
        setIsLoadingButton,
        setSearchQuery,
        searchQuery,
      }}
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

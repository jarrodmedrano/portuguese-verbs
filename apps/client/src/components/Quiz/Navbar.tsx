import { useContext, useState } from 'react';
import { trpc } from '../../services';
import { Question } from './QuizApp';
import questionsJSON from './questions.json';
import { Sidebar } from '../Sidebar';
import { AppContext } from '../../contexts/AppContext';

type NavbarProps = {
  // eslint-disable-next-line no-unused-vars
};

const Navbar = ({}: NavbarProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarIsOpen((prev) => !prev);
  };
  const defaultQuestions: Question[] = questionsJSON.questions as Question[];
  const [newQuestions, setNewQuestions] = useState<Question[]>([]);
  const { setIsLoading, setQuizQuestions } = useContext(AppContext);
  const [regularity] = useState<string>('regular');
  const [tense] = useState<string>('presente');
  const [verbType] = useState<string>('ar');
  const [difficulty] = useState<string>('A1');
  const [preferredLanguage] = useState<string>('en-us');
  const [language] = useState<string>('brazilian portuguese');
  const [selectedVerbTypes, setSelectedVerbTypes] = useState<Set<string>>(new Set());
  const [selectedTenses, setSelectedTenses] = useState<Set<string>>(new Set());
  const [selectedRegularities, setSelectedRegularities] = useState<Set<string>>(new Set());

  function findFirstArrayInString(str: string, index = 0, firstArrayStart = -1, bracketsCount = 0): string {
    // Base case: if we've reached the end of the string, return null
    if (index === str.length) {
      return '';
    }

    // Current character in the string
    const char = str[index];

    // If we encounter an opening bracket, we need to increase our count
    if (char === '[') {
      bracketsCount++;
      // If it's the first opening bracket we've found, mark its position
      if (firstArrayStart === -1) {
        firstArrayStart = index;
      }
    }
    // If we encounter a closing bracket, we decrease our count
    else if (char === ']') {
      bracketsCount--;
      // If our count is back to zero, we've found the end of the first complete array
      if (bracketsCount === 0 && firstArrayStart !== -1) {
        return str.substring(firstArrayStart, index + 1);
      }
    }

    // Move to the next character in the string
    return findFirstArrayInString(str, index + 1, firstArrayStart, bracketsCount);
  }

  const handleGetMore = async () => {
    try {
      const result = trpc.aiQuestion.get.useQuery({
        tense,
        regularity,
        verbType,
        difficulty,
        language,
        preferredLanguage,
        messages: [
          {
            role: 'assistant',
            content: JSON.stringify(defaultQuestions),
          },
          {
            role: 'user',
            content: 'Write three more questions.',
          },
        ],
      });

      // eslint-disable-next-line no-console
      console.log('result', result);

      const { data } = result;

      // @ts-ignore this line
      const content = data?.choices[0].message.content;
      // eslint-disable-next-line no-console
      console.log('content', content);

      let initialStr = '';
      if (content[0] === '[') {
        initialStr = content;
      } else if (content[0] === '{') {
        initialStr = `[${content}]`;
      } else {
        initialStr = findFirstArrayInString(content);
      }
      // eslint-disable-next-line no-console
      console.log('inti str', initialStr);
      const dataJSON = JSON.parse(initialStr);
      setNewQuestions([...newQuestions, ...dataJSON]);
      setQuizQuestions([...dataJSON, ...defaultQuestions]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('err', error);
    }
  };

  const handleShuffle = () => {
    setIsLoading(true);
    const shuffled = [...defaultQuestions];
    for (let i = defaultQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuizQuestions(shuffled);
    setIsLoading(false);
  };

  const handleCheckBoxSelect = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const value = (event.target as HTMLInputElement).value;

    // eslint-disable-next-line no-console
    console.log('value', value);

    const filterAndSetQuestions = (key: keyof typeof defaultQuestions[0], filterValue: string) => {
      switch (key) {
        case 'verbType':
          setSelectedVerbTypes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(filterValue)) {
              newSet.delete(filterValue);
            } else {
              newSet.add(filterValue);
            }
            return newSet;
          });
          break;
        case 'tense':
          setSelectedTenses((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(filterValue)) {
              newSet.delete(filterValue);
            } else {
              newSet.add(filterValue);
            }
            return newSet;
          });
          break;
        case 'regularity':
          setSelectedRegularities((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(filterValue)) {
              newSet.delete(filterValue);
            } else {
              newSet.add(filterValue);
            }
            return newSet;
          });
          break;
      }

      const filteredQuestions = defaultQuestions.filter(
        (q) =>
          (selectedVerbTypes.size === 0 || selectedVerbTypes.has(q.verbType)) &&
          (selectedTenses.size === 0 || selectedTenses.has(q.tense)) &&
          (selectedRegularities.size === 0 || selectedRegularities.has(q.regularity)),
      );

      setQuizQuestions(filteredQuestions);
    };

    const actions: Record<string, () => void> = {
      'get-questions': handleGetMore,
      shuffle: handleShuffle,
      ar: () => filterAndSetQuestions('verbType', 'ar'),
      ir: () => filterAndSetQuestions('verbType', 'ir'),
      er: () => filterAndSetQuestions('verbType', 'er'),
      presente: () => filterAndSetQuestions('tense', 'presente'),
      'preterito-perfeito': () => filterAndSetQuestions('tense', 'preterito-perfeito'),
      perfeito: () => filterAndSetQuestions('tense', 'perfeito'),
      'futuro-do-presente': () => filterAndSetQuestions('tense', 'futuro-do-presente'),
      'preterito-imperfeito': () => filterAndSetQuestions('tense', 'preterito-imperfeito'),
      regular: () => filterAndSetQuestions('regularity', 'regular'),
      irregular: () => filterAndSetQuestions('regularity', 'irregular'),
      'preterito-mais-que-perfeito': () => filterAndSetQuestions('tense', 'preterito-mais-que-perfeito'),
      'futuro-do-imperfeito': () => filterAndSetQuestions('tense', 'futuro-do-imperfeito'),
      'presente-progressivo': () => filterAndSetQuestions('tense', 'presente-progressivo'),
      'futuro-do-preterito': () => filterAndSetQuestions('tense', 'futuro-do-preterito'),
    };

    if (actions[value]) {
      actions[value]();
    } else if (!value) {
      handleShuffle();
    } else {
      setQuizQuestions(defaultQuestions);
    }
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed left-0 top-0 z-30 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <Sidebar handleClick={handleSidebarClick} isOpen={sidebarIsOpen} onCheckBoxSelect={handleCheckBoxSelect} />
      </aside>
    </>
  );
};
export default Navbar;

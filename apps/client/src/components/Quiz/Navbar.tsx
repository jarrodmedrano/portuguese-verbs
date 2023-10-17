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
  const [regularity, setRegularity] = useState<string>('regular');
  const [tense, setTense] = useState<string>('presente');
  const [verbType, setVerbType] = useState<string>('ar');
  const [difficulty] = useState<string>('A1');
  const [preferredLanguage] = useState<string>('en-us');
  const [language] = useState<string>('brazilian portuguese');

  function findFirstArrayInString(
    str: string,
    index: number = 0,
    firstArrayStart: number = -1,
    bracketsCount: number = 0,
  ): string {
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

  const mutation = trpc.useMutation(['openai.mutate'], {
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log('data', data);
      const content = data.choices[0].message.content;
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
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('err', error);
    },
  });

  const handleGetMore = async () => {
    try {
      await mutation.mutateAsync({
        tense,
        regularity,
        verbType,
        difficulty,
        language,
        preferredLanguage,
        messages: [
          {
            role: 'assistant',
            content: JSON.stringify(newQuestions),
          },
          {
            role: 'user',
            content: 'Write three more questions.',
          },
        ],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('err', error);
    }
  };

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
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLInputElement).value;

    // eslint-disable-next-line no-console
    console.log('value', value);

    switch (value) {
      case undefined:
        handleShuffle();
        break;
      case 'get-questions':
        handleGetMore();
        break;
      case 'shuffle':
        handleShuffle();
        break;
      case 'ar':
        const arQuestions = defaultQuestions.filter((q) => q.verbType === value);
        setQuizQuestions(arQuestions);
        setVerbType(value);
        break;
      case 'ir':
        const irQuestions = defaultQuestions.filter((q) => q.verbType === 'ir');
        setQuizQuestions(irQuestions);
        setVerbType(value);
        break;
      case 'er':
        const erQuestions = defaultQuestions.filter((q) => q.verbType === 'er');
        setQuizQuestions(erQuestions);
        setVerbType(value);
        break;
      case 'presente':
        const presenteQuestions = defaultQuestions.filter((q) => q.tense === 'presente');
        setQuizQuestions(presenteQuestions);
        break;
      case 'preterito-perfeito':
        const ppQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-perfeito');
        setQuizQuestions(ppQuestions);
        setTense('preterito-perfeito');
        break;
      case 'perfeito':
        const pQuestions = defaultQuestions.filter((q) => q.tense === 'perfeito');
        setQuizQuestions(pQuestions);
        setTense('perfeito');
        break;
      case 'futuro-do-presente':
        const fpQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-presente');
        setQuizQuestions(fpQuestions);
        setTense('futuro-do-presente');
        break;
      case 'preterito-imperfeito':
        const piQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-imperfeito');
        setQuizQuestions(piQuestions);
        setTense('preterito-imperfeito');
        break;
      case 'regular':
        const regQuestions = defaultQuestions.filter((q) => q.regularity === 'regular');
        setQuizQuestions(regQuestions);
        setRegularity('regular');
        break;
      case 'irregular':
        const irregQuestions = defaultQuestions.filter((q) => q.regularity === 'irregular');
        setQuizQuestions(irregQuestions);
        setRegularity('irregular');
        break;
      case 'preterito-mais-que-perfeito':
        const fpDQuestions = defaultQuestions.filter((q) => q.tense === 'preterito-mais-que-perfeito');
        setQuizQuestions(fpDQuestions);
        setTense('preterito-mais-que-perfeito');
        break;
      case 'futuro-do-imperfeito':
        const fpIQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-imperfeito');
        setQuizQuestions(fpIQuestions);
        setTense('futuro-do-imperfeito');
        break;
      case 'presente-progressivo':
        const ppPQuestions = defaultQuestions.filter((q) => q.tense === 'presente-progressivo');
        setQuizQuestions(ppPQuestions);
        setTense('presente-progressivo');
        break;
      case 'futuro-do-preterito':
        const fpPQuestions = defaultQuestions.filter((q) => q.tense === 'futuro-do-preterito');
        setQuizQuestions(fpPQuestions);
        setTense('futuro-do-preterito');
        break;
      default:
        setQuizQuestions(defaultQuestions);
        break;
    }
  };

  return (
    <>
      <nav className="z-40 bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <button
                    className="mr-2 rounded bg-red-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="get-questions"
                  >
                    Get More Questions
                  </button>
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                    onClick={handleNavClick}
                    value="shuffle"
                  >
                    <svg
                      height="20px"
                      width="20px"
                      version="1.1"
                      id="_x32_"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <g>
                        <path
                          fill="#fff"
                          d="M418.972,324.766c-2.839-2.106-6.642-2.359-9.748-0.637c-3.081,1.733-4.862,5.102-4.549,8.629l2.624,30.327
		c-14.369-2.214-27.151-5.861-38.752-10.662c-19.448-8.088-35.958-19.484-51.219-33.685c-10.157-9.459-19.689-20.171-28.859-31.796
		c-7.702-9.785-15.116-20.266-22.457-31.074c11.697-17.149,23.66-33.336,36.538-47.513c9.748-10.783,20.026-20.422,31.097-28.678
		c12.66-9.424,26.356-17.065,42.026-22.697c9.652-3.454,20.122-6.114,31.627-7.871l-2.624,30.134
		c-0.313,3.527,1.468,6.896,4.549,8.629c3.106,1.722,6.908,1.469,9.748-0.637l89.418-66.432c2.263-1.708,3.611-4.38,3.611-7.22
		c0-2.841-1.348-5.512-3.611-7.209L418.972,39.93c-2.839-2.106-6.642-2.358-9.748-0.625c-3.081,1.72-4.862,5.102-4.549,8.617
		l2.96,34.057c-23.42,2.624-44.841,8.112-64.216,16.116c-27.848,11.468-51.291,27.811-71.197,46.284
		c-13.286,12.336-25.079,25.61-35.862,39.221c-3.322,4.212-6.523,8.449-9.676,12.697c-3.152-4.248-6.354-8.496-9.675-12.708
		c-10.76-13.611-22.53-26.91-35.791-39.258c-19.881-18.508-43.326-34.876-71.149-46.369C82.269,86.421,50.304,79.922,14.152,79.946
		H0v66.564h14.152c25.056,0.012,45.684,3.864,63.591,10.289c15.669,5.644,29.34,13.311,42.001,22.758
		c11.048,8.256,21.301,17.907,31.074,28.703c12.852,14.201,24.766,30.399,36.465,47.561c-7.342,10.795-14.78,21.265-22.505,31.036
		c-9.171,11.626-18.726,22.325-28.884,31.772c-15.283,14.177-31.794,25.549-51.266,33.624c-19.497,8.028-42.145,12.925-70.475,12.95
		H0v66.551h14.152c31.964,0.024,60.679-5.042,86.12-14.225c22.288-7.992,41.977-19.111,59.306-32.06
		c15.164-11.324,28.546-24.046,40.604-37.392c9.532-10.566,18.245-21.529,26.429-32.589c8.16,11.071,16.848,22.048,26.38,32.614
		c12.058,13.37,25.417,26.102,40.581,37.451c17.304,12.974,36.97,24.106,59.234,32.133c16.849,6.089,35.117,10.337,54.806,12.552
		l-2.937,33.841c-0.313,3.515,1.468,6.896,4.549,8.617c3.106,1.734,6.908,1.48,9.748-0.626l89.418-66.443
		c2.263-1.697,3.611-4.367,3.611-7.208c0-2.84-1.348-5.524-3.611-7.222L418.972,324.766z"
                        />
                      </g>
                    </svg>
                  </button>
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                    onClick={handleNavClick}
                    value="ar"
                  >
                    AR
                  </button>
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                    onClick={handleNavClick}
                    value="ir"
                  >
                    IR
                  </button>
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                    onClick={handleNavClick}
                    value="er"
                  >
                    ER
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="presente"
                  >
                    Presente
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="preterito-perfeito"
                  >
                    Pretérito Perfeito
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="preterito-imperfeito"
                  >
                    Pretérito Imperfeito
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="futuro-do-presente"
                  >
                    Futuro do Presente
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="presente-progressivo"
                  >
                    Presente Progressivo
                  </button>
                  <button
                    className="mr-2 rounded bg-green-500 px-3 py-2 text-xs text-white hover:bg-green-600"
                    onClick={handleNavClick}
                    value="futuro-do-preterito"
                  >
                    Futuro do Pretérito
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <button className="mr-2 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">AR</button>
            <button className="mr-2 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">IR</button>
            <button className="mr-2 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">ER</button>
            <button className="mr-2 rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600">
              Presente
            </button>
            <button className="mr-2 rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600">
              Pretérito Perfeito
            </button>
            <button className="mr-2 rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600">
              Pretérito Imperfeito
            </button>
            <button className="mr-2 rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600">
              Futuro do Presente
            </button>
          </div>
        </div>
      </nav>
      <aside
        id="default-sidebar"
        className="fixed left-0 top-0 -z-30 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <Sidebar handleClick={handleSidebarClick} isOpen={sidebarIsOpen} />
      </aside>
    </>
  );
};
export default Navbar;

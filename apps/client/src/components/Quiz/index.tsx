import React from 'react';
import ReactDOM from 'react-dom/client';
import QuizApp from './QuizApp';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QuizApp />
  </React.StrictMode>,
);

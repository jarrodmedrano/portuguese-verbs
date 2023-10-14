import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizApp from './QuizApp';
import { expect, test } from 'vitest';

test('renders learn react link', () => {
  render(<QuizApp />);
  expect(screen).toBeTruthy();
});

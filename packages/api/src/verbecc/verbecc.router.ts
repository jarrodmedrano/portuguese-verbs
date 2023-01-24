import { createRouter } from '../app/app.router';
import { getConjugation } from './verbecc.controller';

export const verbecc = createRouter().query('get', {
  resolve: getConjugation,
});

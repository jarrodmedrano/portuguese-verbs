import { createRouter } from '../app/app.router';
import { getVerbs } from './verb.controller';

export const Verbs = createRouter().query('get', {
  resolve: getVerbs,
});

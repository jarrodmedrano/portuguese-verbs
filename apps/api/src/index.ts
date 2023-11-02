import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { appRouter, mergeRouters } from './app/app.router';

import { openaiRouter } from './openai/openai.router';
import { questionsRouter } from './questions/question.router';
import { verbRouter } from './verb/verb.router';
import { verbeccRouter } from './verbecc/verbecc.router';

export const router = mergeRouters(appRouter, questionsRouter, openaiRouter, verbRouter, verbeccRouter);

export type AppRouter = typeof appRouter;
export type TRPCRouter = typeof router;

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
dotenvExpand.expand(config);

export * as OpenAITypes from './openai/types';

const app = express();

const createContext = () => ({}); // no context

app.use(express.json());

app.use(cors());

app.use('/health', (_, res) => {
  // eslint-disable-next-line no-console
  console.log('health checked!');
  res.sendStatus(200);
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router,
    createContext,
  }),
);

app.listen(process.env.TRPC_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The application is listening on port ${process.env.TRPC_PORT}!`);
});

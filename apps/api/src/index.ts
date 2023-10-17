import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { createRouter } from './app/app.router';
import { verbecc } from './verbecc/verbecc.router';
import { verb } from './verb/verb.router';
import { openaiRouter } from './openai/openai.router';

const appRouter = createRouter().merge('verbecc.', verbecc).merge('verb.', verb).merge('openai.', openaiRouter);

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
dotenvExpand.expand(config);

export type AppRouter = typeof appRouter;

export * as OpenAITypes from './openai/types';

const app = express();

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
    router: appRouter,
    createContext: () => null,
  }),
);

app.listen(process.env.TRPC_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The application is listening on port ${process.env.TRPC_PORT}!`);
});

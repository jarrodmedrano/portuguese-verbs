import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { createRouter } from './app/app.router';
import { verbecc } from './verbecc/verbecc.router';
import { verb } from './verb/verb.router';
const appRouter = createRouter().merge('verbecc.', verbecc).merge('verb.', verb);

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const config = dotenv.config();
dotenvExpand.expand(config);

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

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

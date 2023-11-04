import { TRPCRouter } from 'api';

import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';

export const trpc = createTRPCReact<TRPCRouter>();

export const client = new QueryClient();

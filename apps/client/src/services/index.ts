'use client';
import { createReactQueryHooks } from '@trpc/react';
import { QueryClient } from 'react-query';

export const trpc = createReactQueryHooks();

export const client = new QueryClient();

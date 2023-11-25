import * as trpcNext from '@trpc/server/adapters/next';
import { router } from 'api';
// export API handler
// @see https://trpc.io/docs/server/adapters
export default trpcNext.createNextApiHandler({
  router,
  createContext: () => ({}),
});

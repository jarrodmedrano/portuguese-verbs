import { api } from '../../trpc/server-invoker';

export async function ServerInvokedGreeting() {
  const greeting2 = await api.questions.query({
    language: 'pt-br',
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
  });

  return (
    <div>
      <p>{JSON.stringify(greeting2)}</p>
    </div>
  );
}

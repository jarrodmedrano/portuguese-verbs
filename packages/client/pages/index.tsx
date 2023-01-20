import type { NextPage } from 'next';
import { useState } from 'react';
import TodoList from '../src/components/TodoList';
import { client, trpc } from '../src/services';

const Home: NextPage = () => {
  const [item_text, setItemText] = useState<string>('');
  const createTodo = trpc.useMutation('todos.create');

  const onAdd = () => {
    createTodo.mutate(item_text, {
      onSuccess: () => {
        client.invalidateQueries(['todos.get']);
        setItemText('');
      },
      onError: (error) => alert(error.message),
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-teal-500 font-sans">
      <div className="m-4 w-full rounded bg-white p-6 shadow lg:w-1/2">
        <div className="mb-4">
          <h1 className="text-gray-900">Todo List</h1>
          <div className="mt-4 flex">
            <input
              className="mr-4 w-full appearance-none rounded border py-2 px-3 text-gray-900 shadow"
              placeholder="Add Todo"
              value={item_text}
              onChange={(e) => setItemText(e.target.value)}
            />
            <button
              className="flex-no-shrink text-teal border-teal rounded border-2 p-2 hover:bg-teal-800 hover:text-white"
              onClick={onAdd}
            >
              Add
            </button>
          </div>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Home;

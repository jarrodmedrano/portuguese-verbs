import React from 'react';
import { client, trpc } from '../services';

type Props = {};

const TodoList = (props: Props) => {
  const { data, isLoading, isError, error } = trpc.useQuery(['todos.get']);
  const deleteTodo = trpc.useMutation('todos.delete');
  const updateTodoStatus = trpc.useMutation('todos.update');

  const onDelete = (id: number) => {
    deleteTodo.mutate(id, {
      onSuccess: () => {
        client.invalidateQueries(['todos.get']);
      },
    });
  };

  const onUpdateStatus = (id: number) => {
    updateTodoStatus.mutate(id, {
      onSuccess: () => {
        client.invalidateQueries(['todos.get']);
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );

  if (isError || !data)
    return (
      <div className="mb-4 rounded-lg bg-red-100 py-5 px-6 text-base text-red-700" role="alert">
        Error: {JSON.stringify(error?.message)}
      </div>
    );

  return (
    <div>
      {data.map((todo) => (
        <div className="mb-4 flex items-center" key={todo.id}>
          <p
            onClick={() => onUpdateStatus(todo.id)}
            className={`w-full text-gray-900 hover:cursor-pointer ${todo.status && 'line-through'}`}
          >
            {todo.item_text}
          </p>
          <button
            className="flex-no-shrink text-red border-red ml-2 rounded border-2 p-2 hover:bg-red-500 hover:text-white"
            onClick={() => onDelete(todo.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

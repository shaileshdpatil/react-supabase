import React from 'react';
import { useTodo } from '../context/TodoContext';
import TodoBox from './TodoBox';

const TodoList: React.FC = () => {
  const { todos, loading } = useTodo();

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500">No tasks yet. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoBox key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList; 
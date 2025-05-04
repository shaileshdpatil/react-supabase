import React from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

const Todo: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Todo List</h1>
      <TodoInput />
      <TodoList />
    </div>
  );
};

export default Todo; 
import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import Button from './Button';

const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addTodo(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-3 focus:outline-none bg-white"
        />
        <Button type="submit" disabled={!title.trim()}>
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default TodoInput; 
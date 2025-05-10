import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import TodoModal from './TodoModal';

const TodoInput: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addTodo } = useTodo();

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Task
        </button>
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTodo}
        mode="add"
      />
    </>
  );
};

export default TodoInput; 
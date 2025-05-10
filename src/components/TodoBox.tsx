import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { Todo } from '../types/todo.types';
import TodoModal from './TodoModal';

interface TodoBoxProps {
  todo: Todo;
}

const TodoBox: React.FC<TodoBoxProps> = ({ todo }) => {
  const { deleteTodo, updateTodo, toggleTodo } = useTodo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id, !todo.completed);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleUpdate = async (title: string) => {
    try {
      await updateTodo(todo.id, title);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = todo.attachment?.name && 
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExtension(todo.attachment.name));

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl ${
        todo.completed ? 'opacity-75' : ''
      }`}>
        {/* Image Section */}
        {isImage && todo.attachment ? (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={todo.attachment.url}
              alt={todo.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ) : todo.attachment && (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <svg
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 truncate max-w-[200px] mx-auto">
                {todo.attachment.name}
              </p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <h3 
              className={`text-xl font-semibold mb-2 flex-1 cursor-pointer ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
              onClick={handleToggle}
            >
              {todo.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                title="Edit"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                title="Delete"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {new Date(todo.created_at).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            {todo.completed && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={todo}
        mode="edit"
      />
    </>
  );
};

export default TodoBox; 
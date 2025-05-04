import React, { useState } from 'react';
import { Todo } from '../types/todo.types';
import { useTodo } from '../context/TodoContext';
import Button from './Button';

interface TodoBoxProps {
  todo: Todo;
}

const TodoBox: React.FC<TodoBoxProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleToggle = () => {
    toggleTodo(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (editValue.trim() !== '') {
      updateTodo(todo.id, editValue);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(todo.title);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-3 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
        />
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="ml-3 p-1 flex-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            className={`ml-3 flex-1 ${
              todo.completed ? 'line-through text-gray-400' : ''
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        {!isEditing && (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="text-blue-500"
          >
            Edit
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="outline"
          size="sm"
          className="text-red-500"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TodoBox; 
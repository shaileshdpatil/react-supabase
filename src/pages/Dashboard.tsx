import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodo } from '../context/TodoContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user, signOut } = useAuth();
  const { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodo();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo(newTodo);
    setNewTodo('');
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo(id, !completed);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleEdit = (id: string, title: string) => {
    setEditId(id);
    setEditText(title);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId && editText.trim()) {
      await updateTodo(editId, editText);
      setEditId(null);
      setEditText('');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <p className="mr-4">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Todo</h2>
            <form onSubmit={handleAddTodo} className="flex items-center">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : todos.length === 0 ? (
              <p className="text-gray-500">No tasks yet. Add your first one!</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                  <li key={todo.id} className="py-4">
                    {editId === todo.id ? (
                      <form onSubmit={handleUpdate} className="flex items-center">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white p-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="bg-gray-600 text-white p-2 rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id={`todo-${todo.id}`}
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo.id, todo.completed)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`ml-3 ${
                              todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}
                          >
                            {todo.title}
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(todo.id, todo.title)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
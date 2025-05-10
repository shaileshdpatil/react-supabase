import React, { useEffect, useState } from 'react';
import { useTodo } from '../context/TodoContext';
import TodoBox from './TodoBox';
import { TodoFilter } from '../types/todo';

const TodoList: React.FC = () => {
  const { todos, loading } = useTodo();
  const [filter, setFilter] = useState<TodoFilter>('all');

  // useEffect(()=>{
  //   const data = supabase.functions.invoke("hello-world", {
  //     body: { name: "shailesh" }
  //   })
  // },[])

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filterButtons: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap justify-center gap-2">
          {filterButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Todo Grid */}
      {filteredTodos.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="max-w-sm mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              {filter === 'all'
                ? 'No tasks yet. Add a new task to get started!'
                : `No ${filter} tasks found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredTodos.map((todo) => (
            <TodoBox key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList; 
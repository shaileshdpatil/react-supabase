import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Todo, TodoContextType } from '../types/todo.types';
import { useAuth } from './AuthContext';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        user_id: user?.id,
        completed: false,
      };

      const { data, error } = await supabase.from('todos').insert([newTodo]).select();

      if (error) throw error;
      if (data) setTodos((prev) => [data[0], ...prev]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ title })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const value = {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}; 
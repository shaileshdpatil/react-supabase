import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Todo, TodoContextType } from '../types/todo.types';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodos();
      setupRealtimeSubscription();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const newSubscription = supabase
      .channel('todos_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newTodo = payload.new as Todo;
          setTodos((prev) => [newTodo, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedTodo = payload.new as Todo;
          setTodos((prev) =>
            prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
          );
        } else if (payload.eventType === 'DELETE') {
          const deletedTodo = payload.old as Todo;
          setTodos((prev) => prev.filter((todo) => todo.id !== deletedTodo.id));
        }
      })
      .subscribe();

    setSubscription(newSubscription);
  };

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

      const { error } = await supabase.from('todos').insert(newTodo);
      if (error) throw error;
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
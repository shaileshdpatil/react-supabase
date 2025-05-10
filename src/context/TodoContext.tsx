import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Todo, TodoContextType } from '../types/todo.types';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_BUCKET = 'files';

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(()=>{
    setupRealtimeSubscription();
  },[])

  useEffect(() => {
    if (user) {
      fetchTodos();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user?.id]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const newSubscription = supabase
      .channel('todos_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos',
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

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError} = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: publicUrl,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const addTodo = async (title: string, description: string, file?: File) => {
    try {
      let attachment;
      if (file) {
        const uploadResult = await uploadFile(file);
        if (uploadResult) {
          attachment = uploadResult;
        }
      }

      const newTodo = {
        title,
        description,
        user_id: user?.id,
        completed: false,
        attachment
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
      // First fetch the todo to get attachment info
      const { data: todoToDelete, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch todo for deletion');
      }

      // If todo has an attachment, delete it first
      if (todoToDelete?.attachment?.path) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([todoToDelete.attachment.path]);

        if (storageError) {
          throw new Error('Failed to delete attached file');
        }
      }

      // After successful file deletion (if any), delete the todo
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) {
        throw new Error('Failed to delete todo');
      }

    } catch (error) {
      console.error('Error in delete operation:', error);
      throw error; // Re-throw to handle in the UI layer
    }
  };

  const updateTodo = async (id: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ title, description })
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
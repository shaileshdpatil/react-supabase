export interface Todo {
  id: string;
  title: string;
  description: string;
  attachment?: {
    url: string;
    name: string;
  };
  completed: boolean;
  createdAt: string;
}

export type TodoFilter = 'all' | 'completed' | 'active';

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (title: string, description: string, file?: File) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
} 
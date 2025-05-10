export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  user_id: string;
  attachment?: {
    url: string;
    name: string;
    path: string;
  };
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (title: string, description: string, file?: File) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, title: string, description: string) => Promise<void>;
} 
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
} 
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

interface FormValues {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  signUp: (data:FormValues) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
} 
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const handleEmailSignupCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (session) {
            navigate(from, { replace: true });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleEmailSignupCallback();
  }, [from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to your account" 
      error={error}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          label="Email address"
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          label="Password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login; 
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useRedirectIfAuthenticated } from '../utils/useRedirectIfAuthenticated';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { loading: authLoading } = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Sign up to get started" 
      error={error}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="full-name"
          name="full-name"
          type="text"
          autoComplete="name"
          required={true}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          label="Full Name"
        />
        
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
          autoComplete="new-password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          label="Password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignUp; 
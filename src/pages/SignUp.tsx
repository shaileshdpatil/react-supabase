import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

interface FormValues {
  fullName: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setLoading(true);

    try {
      await signUp(formValues);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Sign up to get started" 
      error={error}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required={true}
          value={formValues.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          label="Full Name"
        />
        
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required={true}
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter your email"
          label="Email address"
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required={true}
          value={formValues.password}
          onChange={handleChange}
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
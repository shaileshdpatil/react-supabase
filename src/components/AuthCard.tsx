import React, { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  error: string | null;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="pt-6 pb-2 px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="mt-1 text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard; 
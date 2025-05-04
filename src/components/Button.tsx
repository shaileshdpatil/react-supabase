import React, { ReactNode } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  disabled = false,
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
}) => {
  const baseStyles = "flex cursor-pointer justify-center items-center px-5 py-2.5 border rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variantStyles = {
    primary: "bg-gray-800 hover:bg-gray-900 border-transparent text-white focus:ring-gray-500",
    secondary: "bg-gray-100 hover:bg-gray-200 border-transparent text-gray-700 focus:ring-gray-500",
    outline: "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 focus:ring-gray-500"
  };
  
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button; 
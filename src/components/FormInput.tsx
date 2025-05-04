import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type,
  autoComplete,
  required = true,
  value,
  onChange,
  placeholder,
  label
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
      />
    </div>
  );
};

export default FormInput; 
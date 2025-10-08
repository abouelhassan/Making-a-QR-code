import React from 'react';
import type { InputFieldProps } from '../types';

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, placeholder, type = 'text', as = 'input' }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900"
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

export default InputField;

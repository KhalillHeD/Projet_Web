import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>{icon}</div>}
        <input
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-xl border-2 border-transparent focus:border-[color:var(--secondary)] focus:outline-none transition-all duration-300 bg-card text-[color:var(--text)] ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  );
};

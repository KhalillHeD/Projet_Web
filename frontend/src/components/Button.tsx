import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0';

  const variantClasses = {
    primary: 'bg-[color:var(--primary)] text-white hover:brightness-110 shadow-md',
    secondary: 'bg-[color:var(--secondary)] text-white hover:brightness-110 shadow-md',
    success: 'bg-[color:var(--success)] text-white hover:brightness-95 shadow-md',
    warning: 'bg-[color:var(--warning)] text-white hover:brightness-95 shadow-md',
    error: 'bg-[color:var(--error)] text-white hover:brightness-95 shadow-md',
    outline: 'bg-transparent text-[color:var(--accent)] border-2 border-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white shadow-sm',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

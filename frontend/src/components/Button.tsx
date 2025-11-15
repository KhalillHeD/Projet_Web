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
    primary: 'bg-[#1A6AFF] text-white hover:bg-[#1557d9] shadow-md',
    secondary: 'bg-[#3E8BFF] text-white hover:bg-[#2b7aed] shadow-md',
    success: 'bg-[#16C47F] text-white hover:bg-[#13ad70] shadow-md',
    warning: 'bg-[#FFA726] text-white hover:bg-[#f59518] shadow-md',
    error: 'bg-[#EF5350] text-white hover:bg-[#e53935] shadow-md',
    outline: 'bg-white text-[#1A6AFF] border-2 border-[#1A6AFF] hover:bg-[#1A6AFF] hover:text-white shadow-sm',
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

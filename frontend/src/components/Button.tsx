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
  const baseClasses = 'font-semibold rounded-2xl transition-all duration-500 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';

  const variantClasses = {
    primary: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-white/10',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 shadow-md border border-slate-100',
    success: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-white/10',
    warning: 'bg-gradient-to-tr from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border border-white/10',
    error: 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 border border-white/10',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600/20 hover:border-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-xs tracking-wider uppercase',
    md: 'px-7 py-3.5 text-sm font-bold',
    lg: 'px-10 py-4.5 text-base font-bold',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {icon && <span className="flex items-center transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick, style }) => {
  const hoverClasses = hover ? 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${hoverClasses} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

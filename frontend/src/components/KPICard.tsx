import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, color, delay = 0 }) => {
  return (
    <Card
      hover
      className="animate-slide-up relative overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {value}
          </h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-1.5 text-sm font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <div className={`p-1 rounded-full ${trend >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </div>
              <span>{Math.abs(trend)}%</span>
              <span className="text-slate-400 font-normal ml-0.5 text-xs tracking-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-tr ${color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
        {React.cloneElement(icon as React.ReactElement, { size: 100 })}
      </div>
    </Card>
  );
};

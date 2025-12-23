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
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{title}</p>
          <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>{value}</h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-[color:var(--success)]' : 'text-[color:var(--error)]'}`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

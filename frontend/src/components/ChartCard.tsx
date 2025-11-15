import React from 'react';
import { Card } from './Card';

interface ChartData {
  month: string;
  revenue: number;
  expenses?: number;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  type: 'line' | 'bar';
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, data, type }) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses || 0)));

  return (
    <Card className="animate-fade-in">
      <h3 className="text-xl font-bold text-[#0B1A33] mb-6">{title}</h3>
      <div className="space-y-4">
        {type === 'line' && (
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1A6AFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1A6AFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#lineGradient)"
                stroke="none"
                points={data
                  .map((d, i) => {
                    const x = (i / (data.length - 1)) * 800;
                    const y = 250 - (d.revenue / maxValue) * 200;
                    return `${x},${y}`;
                  })
                  .join(' ') + ' 800,250 0,250'}
              />
              <polyline
                fill="none"
                stroke="#1A6AFF"
                strokeWidth="3"
                points={data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 800;
                  const y = 250 - (d.revenue / maxValue) * 200;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 800;
                const y = 250 - (d.revenue / maxValue) * 200;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#1A6AFF"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              {data.map((d, i) => (
                <span key={i}>{d.month}</span>
              ))}
            </div>
          </div>
        )}

        {type === 'bar' && (
          <div className="space-y-3">
            {data.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#0B1A33]">{d.month}</span>
                  <div className="flex gap-4">
                    <span className="text-[#1A6AFF]">${(d.revenue / 1000).toFixed(1)}k</span>
                    {d.expenses && <span className="text-[#EF5350]">${(d.expenses / 1000).toFixed(1)}k</span>}
                  </div>
                </div>
                <div className="flex gap-2 h-8">
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF] transition-all duration-500 rounded-lg"
                      style={{ width: `${(d.revenue / maxValue) * 100}%` }}
                    />
                  </div>
                  {d.expenses && (
                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#EF5350] to-[#e53935] transition-all duration-500 rounded-lg"
                        style={{ width: `${(d.expenses / maxValue) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {type === 'bar' && (
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-[#1A6AFF] to-[#3E8BFF] rounded-full"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          {data[0].expenses !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-[#EF5350] to-[#e53935] rounded-full"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

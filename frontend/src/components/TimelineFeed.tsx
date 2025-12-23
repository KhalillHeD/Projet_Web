import React from 'react';
import { Card } from './Card';

interface Activity {
  id: string;
  type: string;
  message: string;
  date: string;
  icon: string;
}

interface TimelineFeedProps {
  activities: Activity[];
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({ activities }) => {
  return (
    <Card className="animate-fade-in">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex gap-4 animate-slide-in-left"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[color:var(--secondary)] to-[color:var(--primary)] rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                {activity.icon}
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 h-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 8 }}></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>{activity.message}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

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
      <h3 className="text-xl font-bold text-[#0B1A33] mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex gap-4 animate-slide-in-left"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A6AFF] to-[#3E8BFF] rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                {activity.icon}
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-[#0B1A33] font-medium mb-1">{activity.message}</p>
              <p className="text-sm text-gray-500">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

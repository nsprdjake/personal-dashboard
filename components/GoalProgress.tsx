'use client';

import type { Goal } from '@/lib/supabase';

interface GoalProgressProps {
  goal: Goal;
}

export default function GoalProgress({ goal }: GoalProgressProps) {
  const progress = goal.target_value
    ? Math.min(100, (goal.current_value / goal.target_value) * 100)
    : 0;

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-white font-medium">{goal.title}</h4>
          {goal.description && (
            <p className="text-purple-200 text-sm">{goal.description}</p>
          )}
        </div>
        <span className="text-purple-200 text-sm">
          {goal.current_value} / {goal.target_value} {goal.unit}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-center"
          style={{ width: `${progress}%` }}
        >
          {progress > 10 && (
            <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface QuickAddButtonsProps {
  onAdd: (type: string) => void;
  onRefresh: () => void;
}

export default function QuickAddButtons({ onAdd, onRefresh }: QuickAddButtonsProps) {
  const [adding, setAdding] = useState(false);

  async function quickAdd(type: string, data: any) {
    setAdding(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      await supabase.from(type).insert([{ ...data, date: today }]);
      await onRefresh();
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => quickAdd('bailey_walks', { notes: 'Quick walk log' })}
        disabled={adding}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
      >
        🐕 Log Walk
      </button>
      <button
        onClick={() => onAdd('meals')}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      >
        🍽️ Add Meal
      </button>
      <button
        onClick={() => onAdd('wins')}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      >
        ✅ Add Win
      </button>
      <button
        onClick={() => onAdd('challenges')}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      >
        ⚡ Add Challenge
      </button>
      <button
        onClick={() => onAdd('mood_entries')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      >
        😊 Log Mood
      </button>
      <button
        onClick={() => onAdd('work_hours')}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      >
        ⏰ Log Hours
      </button>
    </div>
  );
}

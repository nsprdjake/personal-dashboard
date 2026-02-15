'use client';

import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { 
  BaileyWalk, 
  Meal, 
  Win, 
  Challenge, 
  MoodEntry, 
  WorkHours,
  LimitlessReminder,
  LimitlessDecision,
  LimitlessTask,
  Conversation
} from '@/lib/supabase';

type TimelineEntry = {
  id: string;
  date: string;
  timestamp?: string;
  type: 'walk' | 'meal' | 'win' | 'challenge' | 'mood' | 'work' | 'reminder' | 'decision' | 'task' | 'conversation';
  icon: string;
  title: string;
  description?: string;
  metadata?: any;
};

type TimelineProps = {
  baileyWalks: BaileyWalk[];
  meals: Meal[];
  wins: Win[];
  challenges: Challenge[];
  moodEntries: MoodEntry[];
  workHours: WorkHours[];
  reminders: LimitlessReminder[];
  decisions: LimitlessDecision[];
  tasks: LimitlessTask[];
  conversations: Conversation[];
};

const typeColors: Record<string, string> = {
  walk: 'bg-blue-500',
  meal: 'bg-green-500',
  win: 'bg-purple-500',
  challenge: 'bg-red-500',
  mood: 'bg-yellow-500',
  work: 'bg-indigo-500',
  reminder: 'bg-orange-500',
  decision: 'bg-pink-500',
  task: 'bg-cyan-500',
  conversation: 'bg-gray-500',
};

export default function Timeline({
  baileyWalks,
  meals,
  wins,
  challenges,
  moodEntries,
  workHours,
  reminders,
  decisions,
  tasks,
  conversations,
}: TimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set([
    'walk', 'meal', 'win', 'challenge', 'mood', 'work', 'reminder', 'decision', 'task', 'conversation'
  ]));

  // Combine all entries into unified timeline
  const allEntries = useMemo(() => {
    const entries: TimelineEntry[] = [];

    // Bailey Walks
    baileyWalks.forEach(walk => {
      entries.push({
        id: walk.id,
        date: walk.date,
        timestamp: walk.time,
        type: 'walk',
        icon: '🐕',
        title: 'Bailey Walk',
        description: walk.notes || `${walk.duration_minutes || '?'} minutes`,
        metadata: walk,
      });
    });

    // Meals
    meals.forEach(meal => {
      entries.push({
        id: meal.id,
        date: meal.date,
        type: 'meal',
        icon: '🍽️',
        title: meal.meal_type ? `${meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}` : 'Meal',
        description: meal.description,
        metadata: meal,
      });
    });

    // Wins
    wins.forEach(win => {
      entries.push({
        id: win.id,
        date: win.date,
        type: 'win',
        icon: '✅',
        title: win.title,
        description: win.description,
        metadata: win,
      });
    });

    // Challenges
    challenges.forEach(challenge => {
      entries.push({
        id: challenge.id,
        date: challenge.date,
        type: 'challenge',
        icon: '⚡',
        title: challenge.title,
        description: challenge.description,
        metadata: challenge,
      });
    });

    // Mood Entries
    moodEntries.forEach(mood => {
      entries.push({
        id: mood.id,
        date: mood.date,
        timestamp: mood.time,
        type: 'mood',
        icon: '😊',
        title: `Mood: ${mood.mood_score}/10`,
        description: mood.notes || `Energy: ${mood.energy_level}/10, Stress: ${mood.stress_level}/10`,
        metadata: mood,
      });
    });

    // Work Hours
    workHours.forEach(work => {
      entries.push({
        id: work.id,
        date: work.date,
        type: 'work',
        icon: '⏰',
        title: `${work.hours}h - ${work.project || 'Work'}`,
        description: work.description,
        metadata: work,
      });
    });

    // Limitless Reminders
    reminders.forEach(reminder => {
      entries.push({
        id: reminder.id,
        date: reminder.due_date || reminder.created_at.split('T')[0],
        type: 'reminder',
        icon: '📋',
        title: reminder.title,
        description: `Status: ${reminder.status}${reminder.completed ? ' ✓' : ''}`,
        metadata: reminder,
      });
    });

    // Limitless Decisions
    decisions.forEach(decision => {
      entries.push({
        id: decision.id,
        date: decision.date,
        type: 'decision',
        icon: '🤔',
        title: 'Decision',
        description: decision.decision_text,
        metadata: decision,
      });
    });

    // Limitless Tasks
    tasks.forEach(task => {
      entries.push({
        id: task.id,
        date: task.date,
        type: 'task',
        icon: '✅',
        title: task.task_text,
        description: `Priority: ${task.priority}${task.completed ? ' ✓' : ''}`,
        metadata: task,
      });
    });

    // Conversations
    conversations.forEach(conv => {
      entries.push({
        id: conv.id,
        date: conv.date,
        timestamp: conv.timestamp,
        type: 'conversation',
        icon: '💬',
        title: `${conv.platform} - ${conv.sender || 'Unknown'}`,
        description: conv.message_text?.substring(0, 100),
        metadata: conv,
      });
    });

    // Sort by date (most recent first)
    return entries.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date);
      const dateB = new Date(b.timestamp || b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [baileyWalks, meals, wins, challenges, moodEntries, workHours, reminders, decisions, tasks, conversations]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      // Type filter
      if (!selectedTypes.has(entry.type)) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(query);
        const matchesDescription = entry.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDescription;
      }

      return true;
    });
  }, [allEntries, selectedTypes, searchQuery]);

  const toggleType = (type: string) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedTypes(newSelected);
  };

  const typeButtons = [
    { type: 'walk', label: '🐕 Walks', count: baileyWalks.length },
    { type: 'meal', label: '🍽️ Meals', count: meals.length },
    { type: 'win', label: '✅ Wins', count: wins.length },
    { type: 'challenge', label: '⚡ Challenges', count: challenges.length },
    { type: 'mood', label: '😊 Mood', count: moodEntries.length },
    { type: 'work', label: '⏰ Work', count: workHours.length },
    { type: 'reminder', label: '📋 Reminders', count: reminders.length },
    { type: 'decision', label: '🤔 Decisions', count: decisions.length },
    { type: 'task', label: '✅ Tasks', count: tasks.length },
    { type: 'conversation', label: '💬 Conversations', count: conversations.length },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">📅 Timeline - Everything</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search timeline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>

      {/* Type Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {typeButtons.map(({ type, label, count }) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              selectedTypes.has(type)
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Timeline Entries */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <p className="text-white/60 text-center py-8">No entries match your filters</p>
        ) : (
          filteredEntries.map((entry, index) => {
            const showDate = index === 0 || entry.date !== filteredEntries[index - 1].date;

            return (
              <div key={entry.id}>
                {showDate && (
                  <div className="text-purple-200 font-semibold text-sm mb-2 mt-4 first:mt-0">
                    {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                )}
                
                <div className="flex gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className={`${typeColors[entry.type]} w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
                    {entry.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{entry.title}</h3>
                      {entry.timestamp && (
                        <span className="text-xs text-white/50">
                          {format(parseISO(entry.timestamp), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-white/70 line-clamp-2">{entry.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 text-sm text-white/60 text-center">
        Showing {filteredEntries.length} of {allEntries.length} entries
      </div>
    </div>
  );
}

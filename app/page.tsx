'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { BaileyWalk, Meal, Win, Challenge, MoodEntry, WorkHours, Goal } from '@/lib/supabase';
import StatTile from '@/components/StatTile';
import QuickAddButtons from '@/components/QuickAddButtons';
import EntryModal from '@/components/EntryModal';
import TrendChart from '@/components/TrendChart';
import GoalProgress from '@/components/GoalProgress';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [baileyWalks, setBaileyWalks] = useState<BaileyWalk[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [wins, setWins] = useState<Win[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [workHours, setWorkHours] = useState<WorkHours[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedEntries, setSelectedEntries] = useState<any[]>([]);
  const [showEntriesList, setShowEntriesList] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [walksRes, mealsRes, winsRes, challengesRes, moodRes, hoursRes, goalsRes] = await Promise.all([
        supabase.from('bailey_walks').select('*').order('date', { ascending: false }),
        supabase.from('meals').select('*').order('date', { ascending: false }),
        supabase.from('wins').select('*').order('date', { ascending: false }),
        supabase.from('challenges').select('*').order('date', { ascending: false }),
        supabase.from('mood_entries').select('*').order('date', { ascending: false }),
        supabase.from('work_hours').select('*').order('date', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
      ]);

      if (walksRes.data) setBaileyWalks(walksRes.data);
      if (mealsRes.data) setMeals(mealsRes.data);
      if (winsRes.data) setWins(winsRes.data);
      if (challengesRes.data) setChallenges(challengesRes.data);
      if (moodRes.data) setMoodEntries(moodRes.data);
      if (hoursRes.data) setWorkHours(hoursRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    
    const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }
    
    return streak;
  }

  function openModal(type: string) {
    setModalType(type);
    setModalOpen(true);
  }

  function openEntriesList(type: string, entries: any[]) {
    setModalType(type);
    setSelectedEntries(entries);
    setShowEntriesList(true);
  }

  function getFilteredData() {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (viewMode) {
      case 'weekly':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        startDate = subDays(now, 30);
    }

    const filterByDate = (items: any[]) =>
      items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });

    return {
      baileyWalks: filterByDate(baileyWalks),
      meals: filterByDate(meals),
      wins: filterByDate(wins),
      challenges: filterByDate(challenges),
      moodEntries: filterByDate(moodEntries),
      workHours: filterByDate(workHours),
    };
  }

  const filtered = getFilteredData();
  const baileyStreak = calculateStreak(baileyWalks.map(w => w.date));
  const totalWorkHours = filtered.workHours.reduce((sum, h) => sum + (h.hours || 0), 0);
  const avgMoodScore = filtered.moodEntries.length > 0
    ? filtered.moodEntries.reduce((sum, m) => sum + (m.mood_score || 0), 0) / filtered.moodEntries.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎯 Jake's Life Dashboard
          </h1>
          <p className="text-purple-200 text-lg">Track your daily habits, wins, and progress</p>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === mode
                  ? 'bg-white text-purple-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Quick Add Buttons */}
        <QuickAddButtons onAdd={openModal} onRefresh={fetchAllData} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatTile
            emoji="🐕"
            label="Bailey Walks"
            value={filtered.baileyWalks.length}
            subtitle={baileyStreak > 0 ? `🔥 ${baileyStreak} day streak!` : 'No streak yet'}
            onClick={() => openEntriesList('bailey_walks', baileyWalks)}
          />
          <StatTile
            emoji="🍽️"
            label="Meals Logged"
            value={filtered.meals.length}
            subtitle={`Tracking your nutrition`}
            onClick={() => openEntriesList('meals', meals)}
          />
          <StatTile
            emoji="✅"
            label="Wins"
            value={filtered.wins.length}
            subtitle={`Celebrate your successes`}
            onClick={() => openEntriesList('wins', wins)}
          />
          <StatTile
            emoji="⚡"
            label="Challenges"
            value={filtered.challenges.length}
            subtitle={`${filtered.challenges.filter(c => !c.resolved).length} unresolved`}
            onClick={() => openEntriesList('challenges', challenges)}
          />
          <StatTile
            emoji="😊"
            label="Avg Mood"
            value={avgMoodScore.toFixed(1)}
            subtitle={`Out of 10`}
            onClick={() => openEntriesList('mood', moodEntries)}
          />
          <StatTile
            emoji="⏰"
            label="Work Hours"
            value={totalWorkHours.toFixed(1)}
            subtitle={`${viewMode} total`}
            onClick={() => openEntriesList('work_hours', workHours)}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            title="Bailey Walks Trend"
            data={filtered.baileyWalks}
            dataKey="date"
            valueKey="duration_minutes"
            color="#8b5cf6"
          />
          <TrendChart
            title="Mood & Energy Levels"
            data={filtered.moodEntries}
            dataKey="date"
            valueKey="mood_score"
            secondaryKey="energy_level"
            color="#06b6d4"
          />
        </div>

        {/* Goals */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Active Goals</h2>
          <div className="space-y-4">
            {goals.filter(g => g.status === 'active').map(goal => (
              <GoalProgress key={goal.id} goal={goal} />
            ))}
            {goals.filter(g => g.status === 'active').length === 0 && (
              <p className="text-purple-200">No active goals. Set some to track your progress!</p>
            )}
          </div>
        </div>

        {/* Recent Wins */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🎉 Recent Wins</h2>
          <div className="space-y-3">
            {filtered.wins.slice(0, 5).map(win => (
              <div key={win.id} className="bg-white/10 rounded-lg p-4">
                <div className="text-purple-200 text-sm">{format(new Date(win.date), 'MMM dd, yyyy')}</div>
                <div className="text-white font-medium">{win.title}</div>
                {win.description && <div className="text-purple-200 text-sm mt-1">{win.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <EntryModal
          type={modalType}
          onClose={() => setModalOpen(false)}
          onSave={async (data) => {
            // Save to Supabase
            const table = modalType;
            await supabase.from(table).insert([data]);
            await fetchAllData();
            setModalOpen(false);
          }}
        />
      )}

      {showEntriesList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{modalType.replace('_', ' ').toUpperCase()}</h3>
              <button
                onClick={() => setShowEntriesList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {selectedEntries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded">
                  <div className="text-sm text-gray-500">{format(new Date(entry.date), 'MMM dd, yyyy')}</div>
                  <div className="font-medium">{entry.title || entry.description || entry.notes || 'Entry'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type BaileyWalk = {
  id: string;
  date: string;
  time: string;
  duration_minutes?: number;
  distance_miles?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Meal = {
  id: string;
  date: string;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  location?: string;
  calories?: number;
  health_rating?: number;
  created_at: string;
  updated_at: string;
};

export type Win = {
  id: string;
  date: string;
  title: string;
  description?: string;
  category?: string;
  impact_rating?: number;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  date: string;
  title: string;
  description?: string;
  category?: string;
  severity?: number;
  resolved: boolean;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
};

export type MoodEntry = {
  id: string;
  date: string;
  time: string;
  mood_score?: number;
  energy_level?: number;
  stress_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type WorkHours = {
  id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  hours: number;
  project?: string;
  description?: string;
  billable: boolean;
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  target_value?: number;
  current_value: number;
  unit?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  created_at: string;
  updated_at: string;
  completed_at?: string;
};

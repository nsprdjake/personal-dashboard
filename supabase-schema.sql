-- Personal Dashboard Database Schema
-- Created: 2026-02-14

-- Bailey Walks Table
CREATE TABLE IF NOT EXISTS bailey_walks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER,
  distance_miles DECIMAL(4,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bailey_walks_date ON bailey_walks(date DESC);

-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  meal_type VARCHAR(20), -- breakfast, lunch, dinner, snack
  description TEXT NOT NULL,
  location VARCHAR(100),
  calories INTEGER,
  health_rating INTEGER CHECK (health_rating >= 1 AND health_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meals_date ON meals(date DESC);

-- Wins Table
CREATE TABLE IF NOT EXISTS wins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- work, personal, health, creative, etc.
  impact_rating INTEGER CHECK (impact_rating >= 1 AND impact_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wins_date ON wins(date DESC);

-- Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_date ON challenges(date DESC);

-- Mood Tracking Table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mood_entries_date ON mood_entries(date DESC);

-- Work Hours Table
CREATE TABLE IF NOT EXISTS work_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  hours DECIMAL(4,2) NOT NULL,
  project VARCHAR(100),
  description TEXT,
  billable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_work_hours_date ON work_hours(date DESC);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50), -- walks, hours, pounds, etc.
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, paused, abandoned
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Streaks View (calculated)
CREATE OR REPLACE VIEW current_streaks AS
WITH bailey_dates AS (
  SELECT DISTINCT date 
  FROM bailey_walks 
  ORDER BY date DESC
),
bailey_streak AS (
  SELECT 
    COUNT(*) as current_streak,
    MAX(date) as last_date
  FROM (
    SELECT 
      date,
      date - ROW_NUMBER() OVER (ORDER BY date DESC)::INTEGER AS streak_group
    FROM bailey_dates
    WHERE date <= CURRENT_DATE
      AND date >= CURRENT_DATE - INTERVAL '365 days'
  ) grouped
  WHERE streak_group = (
    SELECT date - ROW_NUMBER() OVER (ORDER BY date DESC)::INTEGER
    FROM bailey_dates
    WHERE date <= CURRENT_DATE
    ORDER BY date DESC
    LIMIT 1
  )
),
meal_dates AS (
  SELECT DISTINCT date 
  FROM meals 
  ORDER BY date DESC
),
meal_streak AS (
  SELECT 
    COUNT(*) as current_streak,
    MAX(date) as last_date
  FROM (
    SELECT 
      date,
      date - ROW_NUMBER() OVER (ORDER BY date DESC)::INTEGER AS streak_group
    FROM meal_dates
    WHERE date <= CURRENT_DATE
      AND date >= CURRENT_DATE - INTERVAL '365 days'
  ) grouped
  WHERE streak_group = (
    SELECT date - ROW_NUMBER() OVER (ORDER BY date DESC)::INTEGER
    FROM meal_date
    WHERE date <= CURRENT_DATE
    ORDER BY date DESC
    LIMIT 1
  )
)
SELECT 
  'bailey_walks' as tracker,
  COALESCE((SELECT current_streak FROM bailey_streak), 0) as current_streak,
  COALESCE((SELECT last_date FROM bailey_streak), NULL) as last_date,
  (SELECT COUNT(*) FROM bailey_walks) as total_count
UNION ALL
SELECT 
  'meals' as tracker,
  COALESCE((SELECT current_streak FROM meal_streak), 0) as current_streak,
  COALESCE((SELECT last_date FROM meal_streak), NULL) as last_date,
  (SELECT COUNT(*) FROM meals) as total_count;

-- Enable Row Level Security (RLS) - Single user app, allow all
ALTER TABLE bailey_walks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for single-user dashboard)
CREATE POLICY "Allow all operations on bailey_walks" ON bailey_walks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meals" ON meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wins" ON wins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on challenges" ON challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on mood_entries" ON mood_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on work_hours" ON work_hours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on goals" ON goals FOR ALL USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_bailey_walks_updated_at BEFORE UPDATE ON bailey_walks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wins_updated_at BEFORE UPDATE ON wins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON mood_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_hours_updated_at BEFORE UPDATE ON work_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

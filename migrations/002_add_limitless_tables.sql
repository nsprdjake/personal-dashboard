-- Migration: Add Limitless Integration Tables and Conversations
-- Run this in Supabase SQL Editor to add new tables
-- Date: 2026-02-14

-- ============================================
-- LIMITLESS INTEGRATION TABLES
-- ============================================

-- Limitless Reminders Table
CREATE TABLE IF NOT EXISTS limitless_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'suggested', -- suggested, active, completed, dismissed
  created_by VARCHAR(20) DEFAULT 'ai', -- ai, user
  source VARCHAR(50) DEFAULT 'limitless', -- limitless, manual
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_limitless_reminders_due_date ON limitless_reminders(due_date);
CREATE INDEX idx_limitless_reminders_status ON limitless_reminders(status);
CREATE INDEX idx_limitless_reminders_completed ON limitless_reminders(completed);

-- Limitless Decisions Table
CREATE TABLE IF NOT EXISTS limitless_decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  decision_text TEXT NOT NULL,
  context TEXT,
  source VARCHAR(50) DEFAULT 'limitless',
  tags TEXT[], -- array of tags for categorization
  impact_rating INTEGER CHECK (impact_rating >= 1 AND impact_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_limitless_decisions_date ON limitless_decisions(date DESC);

-- Limitless Tasks Table
CREATE TABLE IF NOT EXISTS limitless_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  task_text TEXT NOT NULL,
  context TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(50) DEFAULT 'limitless',
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_limitless_tasks_date ON limitless_tasks(date DESC);
CREATE INDEX idx_limitless_tasks_completed ON limitless_tasks(completed);

-- Limitless Transcripts Table (metadata only, not full text)
CREATE TABLE IF NOT EXISTS limitless_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(500),
  word_count INTEGER,
  summary TEXT,
  file_path TEXT, -- path to actual transcript file
  participants TEXT[], -- array of participant names
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_limitless_transcripts_date ON limitless_transcripts(date DESC);

-- ============================================
-- CONVERSATIONS TABLE (PLACEHOLDER)
-- ============================================

-- Unified Conversations Table
-- Future: Import from Telegram, ChatGPT, Signal, WhatsApp, etc.
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  platform VARCHAR(50) NOT NULL, -- telegram, chatgpt, signal, whatsapp, sms, email
  conversation_id TEXT, -- platform-specific conversation ID
  sender VARCHAR(200),
  recipient VARCHAR(200),
  message_text TEXT,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, voice, video, file
  media_url TEXT, -- if media message
  participants TEXT[], -- array of all conversation participants
  is_group BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_date ON conversations(date DESC);
CREATE INDEX idx_conversations_platform ON conversations(platform);
CREATE INDEX idx_conversations_sender ON conversations(sender);

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Limitless Reminders
ALTER TABLE limitless_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on limitless_reminders" ON limitless_reminders FOR ALL USING (true) WITH CHECK (true);

-- Limitless Decisions
ALTER TABLE limitless_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on limitless_decisions" ON limitless_decisions FOR ALL USING (true) WITH CHECK (true);

-- Limitless Tasks
ALTER TABLE limitless_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on limitless_tasks" ON limitless_tasks FOR ALL USING (true) WITH CHECK (true);

-- Limitless Transcripts
ALTER TABLE limitless_transcripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on limitless_transcripts" ON limitless_transcripts FOR ALL USING (true) WITH CHECK (true);

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS FOR NEW TABLES
-- ============================================

CREATE TRIGGER update_limitless_reminders_updated_at BEFORE UPDATE ON limitless_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_limitless_decisions_updated_at BEFORE UPDATE ON limitless_decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_limitless_tasks_updated_at BEFORE UPDATE ON limitless_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_limitless_transcripts_updated_at BEFORE UPDATE ON limitless_transcripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration complete! ✅

-- Migration: Add Multi-tenant Support (User ID & RLS)
-- Run this in Supabase SQL Editor to prepare for SaaS transformation
-- Date: 2026-02-15

-- ============================================
-- ADD user_id COLUMN TO ALL TABLES
-- ============================================

-- Function to add user_id column safely
CREATE OR REPLACE FUNCTION add_user_id_column(table_name text) RETURNS void AS $$
BEGIN
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid()', table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_id ON %I(user_id)', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Add user_id to original tables
SELECT add_user_id_column('bailey_walks');
SELECT add_user_id_column('meals');
SELECT add_user_id_column('wins');
SELECT add_user_id_column('challenges');
SELECT add_user_id_column('mood_entries');
SELECT add_user_id_column('work_hours');
SELECT add_user_id_column('goals');

-- Add user_id to Limitless tables
SELECT add_user_id_column('limitless_reminders');
SELECT add_user_id_column('limitless_decisions');
SELECT add_user_id_column('limitless_tasks');
SELECT add_user_id_column('limitless_transcripts');
SELECT add_user_id_column('conversations');

-- Drop the helper function
DROP FUNCTION add_user_id_column(text);

-- ============================================
-- UPDATE RLS POLICIES
-- ============================================

-- Function to update RLS policies
CREATE OR REPLACE FUNCTION update_rls_policy(table_name text) RETURNS void AS $$
BEGIN
    -- Drop existing policy if it exists (to avoid conflicts)
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on %I" ON %I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Users can only access their own data on %I" ON %I', table_name, table_name);
    
    -- Create new secure policy
    -- Allows access if:
    -- 1. user_id matches the authenticated user
    -- 2. OR user_id is NULL (legacy data, accessible to everyone/admin until backfilled)
    EXECUTE format('CREATE POLICY "Users can only access their own data on %I" ON %I FOR ALL USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id)', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Update policies for original tables
SELECT update_rls_policy('bailey_walks');
SELECT update_rls_policy('meals');
SELECT update_rls_policy('wins');
SELECT update_rls_policy('challenges');
SELECT update_rls_policy('mood_entries');
SELECT update_rls_policy('work_hours');
SELECT update_rls_policy('goals');

-- Update policies for Limitless tables
SELECT update_rls_policy('limitless_reminders');
SELECT update_rls_policy('limitless_decisions');
SELECT update_rls_policy('limitless_tasks');
SELECT update_rls_policy('limitless_transcripts');
SELECT update_rls_policy('conversations');

-- Drop the helper function
DROP FUNCTION update_rls_policy(text);

-- Migration complete! ✅

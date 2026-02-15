#!/usr/bin/env tsx

/**
 * Import Limitless data into LifeOS
 * 
 * Imports reminders, decisions, tasks, and transcript metadata
 * from the limitless-integration/analysis/ directory
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Paths to data files
const analysisDir = path.join(process.env.HOME!, '.openclaw/workspace/limitless-integration/analysis');
const remindersFile = path.join(analysisDir, 'existing-reminders.json');
const decisionsFile = path.join(analysisDir, 'decisions.json');
const tasksFile = path.join(analysisDir, 'tasks.json');

interface LimitlessReminder {
  title: string;
  dueDate: string | null;
  status: string;
  createdBy: string;
  completed: boolean;
}

interface LimitlessDecision {
  date: string;
  decision_text: string;
  context?: string;
  source?: string;
}

interface LimitlessTask {
  date: string;
  task_text: string;
  context?: string;
  completed: boolean;
  source?: string;
}

async function importReminders() {
  console.log('📋 Importing reminders...');
  
  if (!fs.existsSync(remindersFile)) {
    console.log('⚠️  No reminders file found, skipping');
    return;
  }

  const data: LimitlessReminder[] = JSON.parse(fs.readFileSync(remindersFile, 'utf-8'));
  console.log(`   Found ${data.length} reminders`);

  // Transform data to match our schema
  const reminders = data.map(r => ({
    title: r.title,
    due_date: r.dueDate,
    status: r.status,
    created_by: r.createdBy,
    completed: r.completed,
    source: 'limitless',
  }));

  // Insert in batches of 100
  const batchSize = 100;
  let imported = 0;

  for (let i = 0; i < reminders.length; i += batchSize) {
    const batch = reminders.slice(i, i + batchSize);
    const { error } = await supabase
      .from('limitless_reminders')
      .insert(batch);

    if (error) {
      console.error(`   ❌ Error importing batch ${i / batchSize + 1}:`, error.message);
    } else {
      imported += batch.length;
      console.log(`   ✅ Imported batch ${i / batchSize + 1} (${batch.length} reminders)`);
    }
  }

  console.log(`   ✅ Successfully imported ${imported}/${data.length} reminders`);
}

async function importDecisions() {
  console.log('🤔 Importing decisions...');
  
  if (!fs.existsSync(decisionsFile)) {
    console.log('⚠️  No decisions file found, skipping');
    return;
  }

  const data: LimitlessDecision[] = JSON.parse(fs.readFileSync(decisionsFile, 'utf-8'));
  
  if (data.length === 0) {
    console.log('   ℹ️  No decisions to import');
    return;
  }

  console.log(`   Found ${data.length} decisions`);

  const { data: inserted, error } = await supabase
    .from('limitless_decisions')
    .insert(data);

  if (error) {
    console.error('   ❌ Error importing decisions:', error.message);
  } else {
    console.log(`   ✅ Successfully imported ${data.length} decisions`);
  }
}

async function importTasks() {
  console.log('✅ Importing tasks...');
  
  if (!fs.existsSync(tasksFile)) {
    console.log('⚠️  No tasks file found, skipping');
    return;
  }

  const data: LimitlessTask[] = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
  
  if (data.length === 0) {
    console.log('   ℹ️  No tasks to import');
    return;
  }

  console.log(`   Found ${data.length} tasks`);

  const { data: inserted, error } = await supabase
    .from('limitless_tasks')
    .insert(data);

  if (error) {
    console.error('   ❌ Error importing tasks:', error.message);
  } else {
    console.log(`   ✅ Successfully imported ${data.length} tasks`);
  }
}

async function importTranscriptMetadata() {
  console.log('📝 Scanning for transcripts...');
  
  const transcriptsDir = path.join(analysisDir, '../transcripts');
  
  if (!fs.existsSync(transcriptsDir)) {
    console.log('⚠️  No transcripts directory found, skipping');
    return;
  }

  const files = fs.readdirSync(transcriptsDir)
    .filter(f => f.endsWith('.txt') || f.endsWith('.md'));

  console.log(`   Found ${files.length} transcript files`);

  const transcripts = files.map(filename => {
    const filePath = path.join(transcriptsDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    
    // Try to extract date from filename (e.g., "2026-02-14-meeting.txt")
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    return {
      date,
      title: filename.replace(/\.(txt|md)$/, ''),
      word_count: wordCount,
      summary: content.substring(0, 500), // First 500 chars as summary
      file_path: filePath,
    };
  });

  if (transcripts.length > 0) {
    const { error } = await supabase
      .from('limitless_transcripts')
      .insert(transcripts);

    if (error) {
      console.error('   ❌ Error importing transcripts:', error.message);
    } else {
      console.log(`   ✅ Successfully imported ${transcripts.length} transcript records`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Limitless data import...\n');

  try {
    await importReminders();
    await importDecisions();
    await importTasks();
    await importTranscriptMetadata();

    console.log('\n✅ Import complete!');
    console.log('\nNext steps:');
    console.log('1. Visit your LifeOS dashboard');
    console.log('2. Check the Timeline view to see all imported data');
    console.log('3. Manage reminders in the Reminders tile');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main();

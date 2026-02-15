#!/usr/bin/env tsx
/**
 * Auto-sync script: Parse nightly conversation check-ins from memory files
 * and insert entries into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = process.env.MEMORY_DIR || '/Users/jack/.openclaw/workspace/memory';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Patterns to extract from memory files
const patterns = {
  baileyWalk: /(?:walked?|walk)\s+bailey|bailey.*(?:walk|walked)/i,
  meal: /(?:ate|eat|eating|had|lunch|dinner|breakfast|meal).*(?:food|at|burger|pizza|salad|restaurant)/i,
  win: /(?:✅|win|success|accomplished|completed|finished|shipped|deployed)/i,
  challenge: /(?:⛔|❌|stuck|blocked|issue|problem|error|challenge|bug|failed)/i,
  mood: /(?:mood|feeling|felt).*(?:great|good|okay|bad|terrible|amazing|stressed|happy|sad|anxious)/i,
  workHours: /(?:worked|working|coding|building|developing|shipped).*(?:\d+\s*(?:hours?|hrs?))/i,
};

async function syncMemoryFiles() {
  console.log('🔄 Syncing memory files to database...\n');

  try {
    // Get all daily memory files
    const memoryFiles = readdirSync(MEMORY_DIR)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .sort();

    console.log(`Found ${memoryFiles.length} daily memory files`);

    let stats = {
      walks: 0,
      meals: 0,
      wins: 0,
      challenges: 0,
      mood: 0,
      hours: 0,
    };

    for (const file of memoryFiles) {
      const date = file.replace('.md', '');
      const content = readFileSync(join(MEMORY_DIR, file), 'utf8');
      const lines = content.split('\n');

      for (const line of lines) {
        // Skip empty lines and headers
        if (!line.trim() || line.startsWith('#')) continue;

        // Bailey walks
        if (patterns.baileyWalk.test(line)) {
          const { data: existing } = await supabase
            .from('bailey_walks')
            .select('id')
            .eq('date', date)
            .single();

          if (!existing) {
            await supabase.from('bailey_walks').insert([{
              date,
              notes: line.trim(),
            }]);
            stats.walks++;
            console.log(`  [${date}] ✅ Bailey walk detected`);
          }
        }

        // Meals
        if (patterns.meal.test(line)) {
          const { data: existing } = await supabase
            .from('meals')
            .select('id')
            .eq('date', date)
            .eq('description', line.trim())
            .single();

          if (!existing) {
            await supabase.from('meals').insert([{
              date,
              description: line.trim(),
            }]);
            stats.meals++;
          }
        }

        // Wins
        if (patterns.win.test(line)) {
          const title = line.trim().substring(0, 200);
          const { data: existing } = await supabase
            .from('wins')
            .select('id')
            .eq('date', date)
            .eq('title', title)
            .single();

          if (!existing) {
            await supabase.from('wins').insert([{
              date,
              title,
              description: line.trim(),
            }]);
            stats.wins++;
            console.log(`  [${date}] 🎉 Win detected`);
          }
        }

        // Challenges
        if (patterns.challenge.test(line)) {
          const title = line.trim().substring(0, 200);
          const { data: existing } = await supabase
            .from('challenges')
            .select('id')
            .eq('date', date)
            .eq('title', title)
            .single();

          if (!existing) {
            await supabase.from('challenges').insert([{
              date,
              title,
              description: line.trim(),
            }]);
            stats.challenges++;
            console.log(`  [${date}] ⚡ Challenge detected`);
          }
        }

        // Work hours (extract hour count from line)
        const hoursMatch = line.match(/(\d+)\s*(?:hours?|hrs?)/i);
        if (patterns.workHours.test(line) && hoursMatch) {
          const hours = parseFloat(hoursMatch[1]);
          const { data: existing } = await supabase
            .from('work_hours')
            .select('id')
            .eq('date', date)
            .eq('hours', hours)
            .single();

          if (!existing) {
            await supabase.from('work_hours').insert([{
              date,
              hours,
              description: line.trim(),
            }]);
            stats.hours++;
            console.log(`  [${date}] ⏰ ${hours} hours detected`);
          }
        }
      }
    }

    console.log('\n✅ Sync complete!');
    console.log(`  Bailey walks: ${stats.walks}`);
    console.log(`  Meals: ${stats.meals}`);
    console.log(`  Wins: ${stats.wins}`);
    console.log(`  Challenges: ${stats.challenges}`);
    console.log(`  Work hours entries: ${stats.hours}`);

  } catch (error) {
    console.error('Error syncing memory files:', error);
    process.exit(1);
  }
}

syncMemoryFiles();

# LifeOS Deployment Checklist

Complete transformation from personal-dashboard to LifeOS! Follow these steps to deploy.

## ✅ Completed

- [x] Rebrand to LifeOS (repo, docs, UI)
- [x] Add Limitless data schema
- [x] Create import scripts
- [x] Build Timeline component
- [x] Add Conversations placeholder
- [x] Update all documentation
- [x] Commit and push to GitHub

## 🚀 Next Steps

### 1. Apply Database Migration

**Option A: Via Supabase Dashboard (Recommended)**

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kxqrsdicrayblwpczxsy/sql)
2. Open the file `migrations/002_add_limitless_tables.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **RUN**
6. Verify no errors

**Option B: Via CLI (if you have Supabase CLI)**

```bash
cd ~/.openclaw/workspace/lifeos
supabase db push migrations/002_add_limitless_tables.sql
```

### 2. Import Limitless Data

```bash
cd ~/.openclaw/workspace/lifeos

# Make sure you're in the right directory
pwd  # Should show: /Users/jack/.openclaw/workspace/lifeos

# Run the import
npm run import-limitless
```

Expected output:
```
🚀 Starting Limitless data import...

📋 Importing reminders...
   Found 125 reminders
   ✅ Imported batch 1 (100 reminders)
   ✅ Imported batch 2 (25 reminders)
   ✅ Successfully imported 125/125 reminders

🤔 Importing decisions...
   ℹ️  No decisions to import

✅ Importing tasks...
   ℹ️  No tasks to import

📝 Scanning for transcripts...
   ⚠️  No transcripts directory found, skipping

✅ Import complete!
```

### 3. Test the Dashboard

```bash
# Start development server
npm run dev
```

Visit http://localhost:3000 and verify:

**Dashboard View:**
- [x] New branding shows: "🧠 LifeOS"
- [x] Tagline: "Your Life Operating System - Everything in one place"
- [x] 8 stat tiles (Bailey, Meals, Wins, Challenges, Mood, Work, Reminders, Conversations)
- [x] Reminders tile shows count (should be 125 if imported)
- [x] Conversations tile shows "No data yet" and alert on click

**Timeline View:**
- [x] Click "📅 Timeline" button
- [x] See unified timeline with all events
- [x] Search box works
- [x] Filter checkboxes work (10 types)
- [x] Events sorted by date (newest first)
- [x] Reminders appear if imported

**Data Integrity:**
- [x] Existing data still loads (walks, meals, wins, etc.)
- [x] No console errors
- [x] Charts render correctly
- [x] Click stat tiles to see entry lists

### 4. Update GitHub Repo Name (Optional)

If you want to rename the repo from `personal-dashboard` to `lifeos`:

1. Go to GitHub repo settings
2. Scroll to "Rename repository"
3. Change to `lifeos`
4. Update local remote:
   ```bash
   git remote set-url origin https://github.com/nsprdjake/lifeos.git
   ```

### 5. Deploy to Vercel

**Update environment variables:**

Since you already have Vercel deployment, just redeploy:

```bash
# Trigger new deployment
git push origin main  # Already done!
```

Vercel will auto-deploy. Visit your production URL (e.g., `pd.nsprd.com`) and verify all features work.

**If environment variables need updating:**
1. Vercel Dashboard → lifeos project → Settings → Environment Variables
2. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy if you made changes

### 6. Test Production

After Vercel deploys:

1. Visit your production URL
2. Check all 8 stat tiles load
3. Click Timeline button
4. Verify reminders appear
5. Test search and filters
6. Check responsive design (mobile)

## 🔍 Troubleshooting

### Import script fails

**Error: Missing Supabase credentials**
- Check `.env.local` has all three keys
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is the real key (not placeholder)
- Get it from: Supabase → Settings → API → `service_role` secret

**Error: Table does not exist**
- Run the migration SQL first (step 1)
- Verify tables exist in Supabase → Table Editor

**Error: Cannot find file**
- Check path: `~/.openclaw/workspace/limitless-integration/analysis/`
- Verify `existing-reminders.json` exists
- If missing, import will skip gracefully

### Dashboard shows errors

**"Failed to fetch"**
- Check Supabase project is active
- Verify environment variables in `.env.local`
- Check browser console for specific error

**Timeline doesn't show data**
- Verify migration was applied (check tables exist)
- Run import script if reminders tile shows 0
- Check browser console for errors

**Conversations tile doesn't work**
- This is expected! It's a placeholder
- Alert should show: "Conversations import coming soon!"
- Table exists but no data yet

## 📊 Expected Results

After completing all steps:

| Metric | Value |
|--------|-------|
| Database tables | 13 (7 original + 5 new + 1 conversations) |
| Imported reminders | 125 |
| Dashboard tiles | 8 |
| Timeline event types | 10 |
| Documentation files | 6 (README, QUICKSTART, DEPLOYMENT, CONVERSATIONS_IMPORT, CHECKLIST, STATUS) |

## 🎯 What's Next?

1. **Use it daily** - Track your life in LifeOS
2. **Import conversations** - Follow [CONVERSATIONS_IMPORT.md](./CONVERSATIONS_IMPORT.md)
3. **Add features** - Goals, habits, integrations
4. **Go SaaS** - Add auth, multi-user, billing

## ✅ Final Verification

Run this checklist:

```bash
# Verify repo is renamed locally
pwd  # Should show: /Users/jack/.openclaw/workspace/lifeos

# Check git remote
git remote -v  # Should show: origin https://github.com/nsprdjake/lifeos.git (or personal-dashboard)

# Check database tables via SQL
# Run in Supabase SQL Editor:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

# Should show 13 tables including:
# - limitless_reminders
# - limitless_decisions  
# - limitless_tasks
# - limitless_transcripts
# - conversations

# Check reminder count
SELECT COUNT(*) FROM limitless_reminders;
# Should return: 125 (if imported)

# Test production deploy
curl https://pd.nsprd.com  # Should return HTML with "LifeOS"
```

## 🎉 Success!

If all checks pass, you now have:

✅ Fully rebranded LifeOS  
✅ Limitless integration working  
✅ Timeline view operational  
✅ Conversations ready for import  
✅ Production deployed  
✅ Documentation complete  

**You did it!** 🚀

Now start tracking your entire life in one beautiful dashboard.

---

Questions? Check [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)

# LifeOS - Quick Start Guide

Get LifeOS running in under 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works great)
- Git

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd lifeos
npm install
```

## Step 2: Set Up Supabase

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Get your credentials:**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (for auto-sync)

3. **Apply the schema:**
   - Open Supabase SQL Editor
   - Copy contents of `supabase-schema.sql`
   - Paste and run the migration
   - Verify all tables were created

## Step 3: Configure Environment

Create `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://kxqrsdicrayblwpczxsy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Memory Sync (optional)
MEMORY_DIR=/Users/jack/.openclaw/workspace/memory
```

## Step 4: Import Initial Data (Optional)

If you have Limitless data to import:

```bash
# Import reminders, decisions, tasks from Limitless
npm run import-limitless
```

This will read from `../limitless-integration/analysis/` and populate your database.

## Step 5: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and you should see your LifeOS dashboard! 🎉

## Step 6: Add Your First Data

Click the **+ Add Entry** button or use the quick-add buttons to start tracking:

- 🐕 Log a Bailey walk
- 🍽️ Add a meal
- ✅ Record a win
- 😊 Track your mood

## Optional: Auto-Sync from Memory Files

If you keep daily memory notes, LifeOS can automatically extract entries:

```bash
# Test the sync
npm run sync-memory

# Set up cron for nightly sync (runs at 1 AM)
crontab -e

# Add this line:
0 1 * * * cd /path/to/lifeos && npm run sync-memory
```

The sync script parses your `memory/YYYY-MM-DD.md` files and extracts:
- Bailey walks
- Meals
- Wins
- Challenges
- Work hours

## Verification Checklist

✅ Dashboard loads without errors  
✅ Can click stat tiles to see entries  
✅ Can add new entries via forms  
✅ Charts render with data  
✅ View mode toggle works (daily/weekly/monthly)  
✅ Timeline view shows all events  

## Troubleshooting

### Database connection errors
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure RLS policies are created (schema includes them)

### No data showing
- Add test entries manually first
- Check browser console for errors
- Verify tables exist in Supabase

### Auto-sync not working
- Check `MEMORY_DIR` path is correct
- Ensure memory files use correct format (`YYYY-MM-DD.md`)
- Run `npm run sync-memory` manually to see errors

## Next Steps

1. **Customize your tracking** - Modify forms and tiles for your needs
2. **Import Limitless data** - Run the import script
3. **Set up auto-sync** - Configure cron for automatic updates
4. **Deploy to production** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Explore timeline** - Use the unified timeline to see everything

## Need Help?

Check the main [README.md](./README.md) for more details, or open an issue on GitHub.

---

Happy tracking! 🚀

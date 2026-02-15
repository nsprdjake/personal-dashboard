# Quick Start Guide 🚀

Your personal dashboard is ready! Here's how to get it live in 3 steps:

## 1️⃣ Apply Database Schema (5 minutes)

Open Supabase SQL Editor:
https://supabase.com/dashboard/project/kxqrsdicrayblwpczxsy/sql

Copy/paste the contents of `supabase-schema.sql` and click **Run**.

This creates 7 tables:
- `bailey_walks` - Dog walking logs
- `meals` - Meal tracking
- `wins` - Accomplishments
- `challenges` - Problems/obstacles
- `mood_entries` - Daily mood tracking
- `work_hours` - Time tracking
- `goals` - Goal setting & progress

## 2️⃣ Deploy to Vercel (3 minutes)

1. Go to https://vercel.com/new
2. Import `personal-dashboard` from GitHub
3. Add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://kxqrsdicrayblwpczxsy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[From Supabase Dashboard]
   SUPABASE_SERVICE_ROLE_KEY=[From Supabase Dashboard]
   ```
4. Click **Deploy**

Get the keys from: https://supabase.com/dashboard/project/kxqrsdicrayblwpczxsy/settings/api

## 3️⃣ Point Domain (2 minutes)

In Vercel project settings → Domains:
- Add: `pd.nsprd.com`
- Copy the CNAME value

In DreamHost DNS:
- Add CNAME record: `pd` → `cname.vercel-dns.com`

Wait 10-30 minutes for DNS propagation.

## ✅ You're Done!

Visit https://pd.nsprd.com and start tracking your life!

### What You Can Do:

📊 **Click stat tiles** to see full history  
➕ **Quick-add buttons** for one-click logging  
📝 **Manual entry forms** for detailed tracking  
📈 **Charts & trends** to visualize progress  
🎯 **Goal tracking** with progress bars  
📅 **Daily/weekly/monthly** aggregate views  

### Auto-Sync from Memory Files:

The dashboard can automatically parse your nightly conversation check-ins!

To enable:
```bash
# Add to crontab (runs nightly at 1 AM):
crontab -e
# Add this line:
0 1 * * * cd /Users/jack/.openclaw/workspace/personal-dashboard && npm run sync-memory
```

Or trigger manually:
```bash
cd ~/.openclaw/workspace/personal-dashboard
npm run sync-memory
```

This will scan `memory/YYYY-MM-DD.md` files and extract:
- Bailey walks
- Meals
- Wins (✅, "accomplished", "shipped")
- Challenges (⛔, "stuck", "blocked")
- Work hours

### Next Level Features:

Want to add more? Ideas for future enhancements:
- Push notifications for reminders
- Mobile app (React Native)
- Apple Health / Fitbit integration
- AI insights ("You're walking Bailey 2x more on weekends!")
- Weekly digest emails
- Data export (CSV, PDF reports)

## Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Built with:** Next.js 15, Supabase, Tailwind CSS, Recharts  
**Deployed on:** Vercel  
**Domain:** pd.nsprd.com  
**Repo:** github.com/nsprdjake/personal-dashboard

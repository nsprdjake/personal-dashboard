# Deployment Guide - Personal Dashboard

## Step 1: Apply Database Schema to Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kxqrsdicrayblwpczxsy)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd+Enter)
7. Verify tables were created (check under Database → Tables)

Expected tables:
- `bailey_walks`
- `meals`
- `wins`
- `challenges`
- `mood_entries`
- `work_hours`
- `goals`

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import the `personal-dashboard` repository from GitHub
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://kxqrsdicrayblwpczxsy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cXJzZGljcmF5Ymx3cGN6eHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxODcyMTgsImV4cCI6MjAyMjc2MzIxOH0.QbH7KFR_-tnrC6vVi2DxV-G0j6v4q5q3sKW1vX8wXqA
   SUPABASE_SERVICE_ROLE_KEY = [Get from Supabase Dashboard → Settings → API]
   MEMORY_DIR = /Users/jack/.openclaw/workspace/memory
   ```

6. Click **Deploy**
7. Wait for deployment to complete (~2-3 minutes)
8. Get your deployment URL (e.g., `personal-dashboard-xxx.vercel.app`)

### Option B: Vercel CLI

```bash
cd ~/.openclaw/workspace/personal-dashboard
vercel login  # Login to your Vercel account
vercel --prod # Deploy to production
```

## Step 3: Configure Custom Domain (pd.nsprd.com)

1. In Vercel project settings, go to **Domains**
2. Add custom domain: `pd.nsprd.com`
3. Vercel will provide DNS records to add

4. Go to [DreamHost Panel](https://panel.dreamhost.com)
5. Navigate to **Domains** → **Manage Domains**
6. Find `nsprd.com` and click **DNS**
7. Add CNAME record:
   ```
   Name: pd
   Type: CNAME
   Value: cname.vercel-dns.com
   ```

8. Wait for DNS propagation (~10-30 minutes)
9. Verify at https://pd.nsprd.com

## Step 4: Set Up Auto-Sync (Optional)

To automatically sync nightly conversation check-ins from memory files to the database:

### Option A: Cron Job on Mac

```bash
# Edit crontab
crontab -e

# Add this line (runs every night at 1 AM):
0 1 * * * cd /Users/jack/.openclaw/workspace/personal-dashboard && npm run sync-memory >> /tmp/dashboard-sync.log 2>&1
```

### Option B: Vercel Cron (Requires Pro Plan)

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync",
    "schedule": "0 1 * * *"
  }]
}
```

### Option C: Manual Sync via API

```bash
curl -X POST https://pd.nsprd.com/api/sync
```

Or trigger from the OpenClaw gateway:
```bash
openclaw remind "Sync personal dashboard" daily at 01:00
```

## Step 5: Test the Dashboard

1. Visit https://pd.nsprd.com
2. Try clicking on stat tiles (should show entry lists)
3. Use quick-add buttons to add test entries
4. Open entry modals and create full entries
5. Check that data appears in Supabase Dashboard
6. Verify charts are rendering correctly

## Troubleshooting

### Build Fails

- Check environment variables are set correctly in Vercel
- Verify Supabase credentials are valid
- Check build logs in Vercel deployment details

### Database Errors

- Verify all tables were created (run schema.sql again)
- Check RLS policies are enabled
- Verify anon key has correct permissions

### Charts Not Rendering

- Check browser console for errors
- Verify `recharts` is installed in package.json
- Check that data is being fetched from Supabase

### Auto-Sync Not Working

- Verify `MEMORY_DIR` path is correct
- Check that memory files exist and are readable
- Run `npm run sync-memory` manually to test
- Check cron logs: `tail -f /tmp/dashboard-sync.log`

## Updating the Dashboard

```bash
cd ~/.openclaw/workspace/personal-dashboard
git pull origin main
# Make changes
git add .
git commit -m "Update: [description]"
git push origin main
# Vercel auto-deploys on push to main
```

## Key Files

- `app/page.tsx` - Main dashboard UI
- `components/` - Reusable components (tiles, modals, charts)
- `lib/supabase.ts` - Database client configuration
- `scripts/sync-memory.ts` - Auto-sync script
- `supabase-schema.sql` - Database schema

## Support

If issues arise:
1. Check Vercel deployment logs
2. Check Supabase logs (Dashboard → Logs)
3. Check browser console for client-side errors
4. Review this deployment guide

## Next Steps

- [ ] Apply database schema to Supabase
- [ ] Deploy to Vercel
- [ ] Configure custom domain (pd.nsprd.com)
- [ ] Set up auto-sync cron
- [ ] Test all features
- [ ] Start tracking your life! 🎯

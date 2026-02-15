# LifeOS - Deployment Guide

Deploy LifeOS to production with Vercel in minutes.

## Deployment Options

- **Vercel** (Recommended) - Zero-config Next.js deployment
- **Netlify** - Alternative with similar features
- **Self-hosted** - Docker or VPS deployment

This guide covers Vercel deployment.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project already set up
- Domain name (optional)

## Step 1: Push to GitHub

```bash
cd lifeos

# Initialize git if not already done
git init
git add .
git commit -m "Initial LifeOS setup"

# Create a new GitHub repo, then:
git remote add origin https://github.com/yourusername/lifeos.git
git branch -M main
git push -u origin main
```

## Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings ✅

## Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://kxqrsdicrayblwpczxsy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional (for auto-sync)
MEMORY_DIR=/path/to/memory/files
```

💡 **Tip:** Add these to all environments (Production, Preview, Development)

## Step 4: Deploy!

Click **Deploy** and Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to a global CDN
- Give you a live URL (e.g., `lifeos.vercel.app`)

First deploy takes ~2 minutes.

## Step 5: Custom Domain (Optional)

### Option A: Vercel Domain
Use the provided `*.vercel.app` subdomain for free.

### Option B: Custom Domain

1. In Vercel → Settings → Domains
2. Add your domain (e.g., `lifeos.yourdomain.com`)
3. Vercel will show DNS instructions
4. Add CNAME record in your DNS:

```
CNAME  lifeos  cname.vercel-dns.com
```

5. Wait for DNS propagation (~5-30 minutes)
6. Vercel auto-provisions SSL certificate ✅

Example:
```bash
# DNS Configuration
Type: CNAME
Name: lifeos
Value: cname.vercel-dns.com
TTL: 3600
```

## Step 6: Enable Auto-Sync (Optional)

If you want automatic memory file syncing in production:

### Option A: Vercel Cron Jobs

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync",
    "schedule": "0 1 * * *"
  }]
}
```

This hits your sync API endpoint daily at 1 AM.

### Option B: External Cron

Use a service like:
- GitHub Actions (run workflow daily)
- Zapier (scheduled task)
- Your own server (curl the endpoint)

```bash
# Example: GitHub Actions workflow
# .github/workflows/sync.yml
name: Daily Sync
on:
  schedule:
    - cron: '0 1 * * *'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger sync
        run: curl -X POST https://lifeos.yourdomain.com/api/sync
```

## Verification Checklist

After deployment:

✅ Dashboard loads at your URL  
✅ Can add and view entries  
✅ Database connection works  
✅ Custom domain resolves (if configured)  
✅ SSL certificate is active  
✅ Auto-sync endpoint works (test `/api/sync`)  

## Monitoring & Maintenance

### Vercel Analytics (Optional)

Enable in Vercel dashboard for:
- Page views
- Performance metrics
- User insights

### Error Tracking

Consider adding:
- Sentry (error monitoring)
- LogRocket (session replay)
- Vercel Speed Insights

### Database Backups

Supabase automatically backs up your data, but you can also:

```bash
# Export data periodically
npm run export-data
```

### Updates & Redeployment

Any push to `main` branch auto-deploys to production:

```bash
git add .
git commit -m "Add new feature"
git push origin main
# Vercel auto-deploys in ~1 minute
```

## Environment-Specific Configs

### Production
- Full error tracking
- Analytics enabled
- Caching optimized

### Preview (branch deployments)
- Test new features
- Share with team
- Each PR gets a unique URL

### Development
- Local only
- Debug logging
- Hot reload

## Troubleshooting

### Build fails
- Check Node.js version (needs 18+)
- Verify all dependencies in `package.json`
- Review build logs in Vercel dashboard

### Database connection errors
- Verify environment variables are set
- Check Supabase project is active
- Ensure `NEXT_PUBLIC_` prefix on client vars

### Domain not resolving
- Wait 30 minutes for DNS propagation
- Verify CNAME record is correct
- Clear browser cache / try incognito

### Auto-sync not working
- Check `/api/sync` endpoint returns 200
- Verify `MEMORY_DIR` path is accessible
- Review Vercel function logs

## Security Best Practices

✅ Use environment variables (never commit secrets)  
✅ Enable Supabase RLS policies  
✅ Use `service_role` key only in API routes (server-side)  
✅ Add rate limiting to sensitive endpoints  
✅ Enable Vercel password protection (if needed)  

## Performance Optimization

- **Static Generation:** Pre-render pages at build time
- **ISR:** Incremental Static Regeneration for fresh data
- **Edge Functions:** Deploy API routes to edge for low latency
- **Image Optimization:** Use Next.js `<Image>` component

## Cost Estimation

### Free Tier (Vercel + Supabase)
- ✅ Up to 100GB bandwidth/month
- ✅ Unlimited serverless function invocations
- ✅ 500MB database storage
- ✅ SSL certificate included
- ✅ Preview deployments

**Total cost: $0/month** for personal use!

### Scaling Up
If you go SaaS and need more:
- Vercel Pro: $20/month (team features, more bandwidth)
- Supabase Pro: $25/month (more storage, backups)

## Next Steps

1. ✅ Deploy to production
2. 📊 Add analytics
3. 🔒 Enable authentication (if going multi-user)
4. 📱 Build mobile app
5. 🚀 Launch as SaaS!

---

Questions? Check the [README.md](./README.md) or open an issue.

Happy deploying! 🎉

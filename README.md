# Jake's Personal Dashboard

A beautiful, fully interactive life tracking dashboard built with Next.js and Supabase.

## Features

✅ **Clickable stat tiles** - View full history of entries with dates  
✅ **Manual entry forms** - Add Bailey walks, meals, wins, challenges, mood, work hours  
✅ **Quick-add buttons** - One-click logging for common activities  
✅ **Supabase backend** - All data stored in PostgreSQL database  
✅ **Auto-sync** - Automatically parse nightly conversation check-ins from memory files  
✅ **Beautiful design** - Modern glassmorphism UI with smooth animations  
✅ **Mobile responsive** - Works perfectly on all devices  
✅ **Charts & graphs** - Visualize trends over time with Recharts  
✅ **View modes** - Daily, weekly, and monthly aggregate views  
✅ **Goal tracking** - Set and track progress toward your goals  

## Database Schema

Tables:
- `bailey_walks` - Dog walking logs with duration, distance, notes
- `meals` - Meal tracking with type, location, calories, health rating
- `wins` - Accomplishments with category and impact rating
- `challenges` - Problems/obstacles with severity and resolution tracking
- `mood_entries` - Daily mood, energy, and stress levels
- `work_hours` - Time tracking with project, description, billable flag
- `goals` - Goal setting with progress tracking

## Setup

1. **Apply database schema:**
   ```bash
   # Copy contents of supabase-schema.sql
   # Paste into Supabase SQL Editor
   # Run the migration
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.local` and update with your Supabase credentials

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Auto-sync memory files:**
   ```bash
   npm run sync-memory
   ```

## Auto-Sync from Nightly Check-ins

The dashboard automatically parses your daily memory files (`memory/YYYY-MM-DD.md`) and extracts:

- Bailey walks (mentions of "walked Bailey", "Bailey walk", etc.)
- Meals (mentions of eating, restaurants, specific foods)
- Wins (✅ checkmarks, "accomplished", "shipped", "completed")
- Challenges (⛔ warnings, "stuck", "blocked", "issue")
- Work hours (mentions of hours worked)

### Setting up auto-sync cron:

Add to your crontab:
```bash
# Run every night at 1 AM
0 1 * * * cd /path/to/personal-dashboard && npm run sync-memory
```

Or trigger manually via API:
```bash
curl -X POST https://pd.nsprd.com/api/sync
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MEMORY_DIR` (path to memory files)

4. Deploy!

### Custom Domain

Point `pd.nsprd.com` to your Vercel deployment:
```bash
# Add CNAME record in DNS:
pd.nsprd.com -> cname.vercel-dns.com
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel
- **Auto-sync:** Node.js script parsing memory files

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run sync manually
npm run sync-memory
```

## Roadmap

- [x] Interactive dashboard with clickable tiles
- [x] Manual entry forms for all trackers
- [x] Quick-add buttons
- [x] Supabase integration
- [x] Auto-sync from memory files
- [x] Charts and trends
- [x] Goal tracking
- [ ] Mobile app (React Native)
- [ ] Push notifications for reminders
- [ ] Integration with wearables (Apple Health, Fitbit)
- [ ] AI insights and recommendations
- [ ] Export data (CSV, PDF reports)

## License

Private project for Jake

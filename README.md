# LifeOS - Your Life Operating System

A comprehensive life tracking and analytics platform built with Next.js and Supabase. Track everything that matters: daily habits, decisions, conversations, work, health, and insights - all in one beautiful dashboard.

## 🌟 Features

### Core Tracking
✅ **Bailey Walks** - Dog walking logs with duration, distance, notes  
✅ **Meals** - Food tracking with health ratings, calories, locations  
✅ **Wins & Challenges** - Celebrate successes and track obstacles  
✅ **Mood Tracking** - Daily mood, energy, and stress levels  
✅ **Work Hours** - Time tracking with project tags  
✅ **Goals** - Set and track progress toward your goals  

### Limitless Integration
✨ **AI Reminders** - Import and manage reminders from Limitless AI  
✨ **Decisions** - Track important decisions with context  
✨ **Tasks** - Task management with completion tracking  
✨ **Transcripts** - Link to conversation transcripts  

### Conversations (Coming Soon)
💬 **Unified Timeline** - All your conversations in one place  
💬 **Import Tools** - Telegram, ChatGPT, Signal, WhatsApp support  

### Unified Timeline
📅 **Everything in one view** - See all life events chronologically  
🔍 **Search & Filter** - Find anything instantly  
📊 **Rich Analytics** - Charts, trends, and insights  

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

```bash
# Clone and install
git clone <your-repo>
cd lifeos
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Apply database schema
# Copy supabase-schema.sql into Supabase SQL Editor and run

# Start development
npm run dev
```

Visit `http://localhost:3000`

## 📦 Database Schema

### Core Tables
- `bailey_walks` - Dog walking logs
- `meals` - Meal tracking
- `wins` - Accomplishments
- `challenges` - Problems/obstacles
- `mood_entries` - Mood tracking
- `work_hours` - Time tracking
- `goals` - Goal setting

### Limitless Tables
- `limitless_reminders` - AI-generated reminders
- `limitless_decisions` - Decision tracking
- `limitless_tasks` - Task management
- `limitless_transcripts` - Conversation transcript metadata

### Future Tables
- `conversations` - Unified conversation history (Telegram, ChatGPT, etc.)

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Auto-sync:** Node.js script parsing memory files

## 📊 Auto-Sync from Memory Files

The dashboard automatically parses your daily memory files (`memory/YYYY-MM-DD.md`) and extracts:

- Bailey walks (mentions of "walked Bailey", "Bailey walk", etc.)
- Meals (mentions of eating, restaurants, specific foods)
- Wins (✅ checkmarks, "accomplished", "shipped", "completed")
- Challenges (⛔ warnings, "stuck", "blocked", "issue")
- Work hours (mentions of hours worked)

```bash
# Run sync manually
npm run sync-memory

# Or set up cron (runs every night at 1 AM)
0 1 * * * cd /path/to/lifeos && npm run sync-memory
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

Quick deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## 🛣️ Roadmap

### ✅ Completed
- [x] Interactive dashboard with clickable tiles
- [x] Manual entry forms for all trackers
- [x] Quick-add buttons
- [x] Supabase integration
- [x] Auto-sync from memory files
- [x] Charts and trends
- [x] Goal tracking
- [x] Limitless data integration
- [x] Unified timeline view

### 🚧 In Progress
- [ ] Conversations import (Telegram, ChatGPT)
- [ ] Advanced filtering and search
- [ ] Export features (CSV, PDF)

### 💡 Future Ideas
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Wearables integration (Apple Health, Fitbit)
- [ ] AI insights and recommendations
- [ ] Multi-user support (SaaS version)
- [ ] Team collaboration features
- [ ] Public API
- [ ] Zapier/IFTTT integrations

## 📝 License

Private project for Jake. Future SaaS potential.

## 🤝 Contributing

This is currently a personal project, but open to collaboration as it evolves into a product.

---

Built with ❤️ by Jake

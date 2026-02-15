# Conversations Import Guide

**Status:** 🚧 Coming Soon - Placeholder ready

The `conversations` table is ready in your database, but import tools are not yet built. This guide documents the planned approach.

## Current State

✅ Database schema created  
✅ Placeholder tile on dashboard  
✅ Timeline view supports conversations  
⏸️ Import scripts needed  

## Supported Platforms (Planned)

### Telegram
- **Export method:** Use Telegram Desktop → Settings → Advanced → Export chat history
- **Format:** JSON export
- **Fields mapped:** date, sender, message_text, media_url, is_group

### ChatGPT
- **Export method:** ChatGPT → Settings → Data controls → Export data
- **Format:** JSON conversations.json file
- **Fields mapped:** date, message_text (user vs assistant as sender/recipient)

### Signal
- **Export method:** Signal Desktop backup (SQLite database)
- **Format:** SQLite .db file
- **Note:** Requires external tool like [signal-backup-decode](https://github.com/xeals/signal-back)

### WhatsApp
- **Export method:** Chat → More → Export chat
- **Format:** .txt file with timestamps
- **Fields mapped:** date, sender, message_text

### SMS/iMessage (Apple)
- **Export method:** Mac ~/Library/Messages/chat.db
- **Format:** SQLite database
- **Note:** Requires Mac access and privacy permissions

### Email (Gmail, Outlook)
- **Export method:** Google Takeout / Outlook export
- **Format:** MBOX or EML files
- **Note:** Will need email parsing library

## Planned Import Script

Create `scripts/import-conversations.ts`:

```typescript
#!/usr/bin/env tsx

/**
 * Import conversations from various platforms
 * 
 * Usage:
 *   npm run import-conversations -- --platform telegram --file exports/telegram.json
 *   npm run import-conversations -- --platform chatgpt --file exports/conversations.json
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Platform parsers
async function parseTelegram(filePath: string) {
  // Parse Telegram JSON export
  // Map fields to conversations table schema
}

async function parseChatGPT(filePath: string) {
  // Parse ChatGPT export
  // Extract messages and map to schema
}

async function parseSignal(filePath: string) {
  // Parse Signal backup
  // Requires signal-backup-decode
}

async function parseWhatsApp(filePath: string) {
  // Parse WhatsApp .txt export
  // Regex to extract timestamps, senders, messages
}

// Main import function
async function importConversations(platform: string, filePath: string) {
  console.log(`Importing ${platform} conversations from ${filePath}...`);
  
  let conversations;
  switch (platform) {
    case 'telegram':
      conversations = await parseTelegram(filePath);
      break;
    case 'chatgpt':
      conversations = await parseChatGPT(filePath);
      break;
    case 'signal':
      conversations = await parseSignal(filePath);
      break;
    case 'whatsapp':
      conversations = await parseWhatsApp(filePath);
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  // Insert into database
  const { error } = await supabase
    .from('conversations')
    .insert(conversations);

  if (error) {
    console.error('Import failed:', error);
  } else {
    console.log(`Successfully imported ${conversations.length} messages`);
  }
}
```

## Data Privacy Considerations

⚠️ **Important:** Conversation data is highly personal.

- **Store locally only** - Don't commit exports to git
- **Add to .gitignore:**
  ```
  exports/
  conversations/
  *.json
  *.db
  *.txt
  ```
- **Encryption at rest** - Consider encrypting sensitive messages
- **Access control** - Use RLS policies if going multi-user

## Database Schema Reference

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE,
  platform VARCHAR(50) NOT NULL,        -- telegram, chatgpt, signal, etc.
  conversation_id TEXT,                 -- platform-specific ID
  sender VARCHAR(200),
  recipient VARCHAR(200),
  message_text TEXT,
  message_type VARCHAR(20),             -- text, image, voice, video, file
  media_url TEXT,
  participants TEXT[],                  -- array of participants
  is_group BOOLEAN,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## Example: Telegram Export

1. **Export from Telegram:**
   - Open Telegram Desktop
   - Settings → Advanced → Export chat history
   - Select JSON format
   - Choose date range
   - Export to `~/Downloads/telegram_export/`

2. **Run import (once script is ready):**
   ```bash
   npm run import-conversations -- --platform telegram --file ~/Downloads/telegram_export/result.json
   ```

3. **Verify in timeline:**
   - Visit LifeOS dashboard
   - Click "📅 Timeline" button
   - Filter to 💬 Conversations

## Example: ChatGPT Export

1. **Export from ChatGPT:**
   - ChatGPT → Settings → Data controls → Export data
   - Wait for email with download link
   - Download and extract `conversations.json`

2. **Run import:**
   ```bash
   npm run import-conversations -- --platform chatgpt --file ~/Downloads/conversations.json
   ```

## Implementation Checklist

When building the import scripts:

- [ ] Create `scripts/import-conversations.ts`
- [ ] Add Telegram parser
- [ ] Add ChatGPT parser
- [ ] Add WhatsApp parser
- [ ] Add Signal parser (optional)
- [ ] Add deduplication logic
- [ ] Handle rate limiting for large imports
- [ ] Add progress indicators
- [ ] Test with sample exports
- [ ] Update package.json scripts
- [ ] Add `.gitignore` entries for exports
- [ ] Document privacy best practices

## Timeline Integration

The Timeline component is already ready! Once you import conversations, they will automatically appear with:

- 💬 Icon
- Platform badge (Telegram, ChatGPT, etc.)
- Sender name
- Message preview
- Timestamp

## Search & Filter

The Timeline view supports:
- ✅ Search across message text
- ✅ Filter by platform (checkbox)
- ✅ Date sorting (newest first)

## Next Steps

1. **Decide which platforms to prioritize** (suggest: Telegram + ChatGPT first)
2. **Export sample data** from those platforms
3. **Build parser scripts** for each format
4. **Test import** with small samples
5. **Import full history** once validated
6. **Explore insights** - search your life's conversations!

## SaaS Considerations

If LifeOS becomes a product:

- **OAuth integrations** - Direct API access instead of manual exports
- **Auto-sync** - Periodic background imports
- **End-to-end encryption** - Encrypt messages client-side
- **Data residency** - Let users choose where data is stored
- **Export/delete** - GDPR compliance tools

---

Questions? Check the main [README.md](./README.md) or open an issue.

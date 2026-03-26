# Roblox Dev AI

Enterprise-grade AI platform for Roblox Studio developers.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Groq API (llama-3.3-70b-versatile) |
| Auth | NextAuth.js + Discord OAuth |
| Database | Supabase (PostgreSQL) |

---

## Quick Start

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — edit `backend/.env`:
```
PORT=3001
GROQ_API_KEY=your-groq-key
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
```

**Frontend** — edit `frontend/.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
DISCORD_CLIENT_ID=your-discord-app-client-id
DISCORD_CLIENT_SECRET=your-discord-app-client-secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase_schema.sql` in the SQL Editor

### 4. Set up Discord OAuth

1. Go to [discord.com/developers](https://discord.com/developers/applications)
2. Create a new application
3. Under OAuth2, add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Client Secret to `.env.local`

### 5. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Security Features

- **Helmet** — HTTP security headers
- **CORS** — Whitelist-only origins
- **WAF** — Blocks SQLi, XSS, path traversal patterns
- **Rate Limiting** — 100 req/15min global, 15 req/min for AI chat
- **Input Validation** — express-validator on all inputs
- **API Key Protection** — Groq key never exposed to frontend
- **CSP** — Content Security Policy headers
- **RLS** — Supabase Row Level Security

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/ai` | AI Chat Assistant |
| `/docs` | Documentation |
| `/generator` | Code Generator |
| `/debug` | Script Debugger |
| `/library` | Script Library |
| `/auth/signin` | Discord login |

---

## Credits

© 2026 EclipseByte Softwares  
© 2026 Wind Rose Technologies  
All rights reserved.

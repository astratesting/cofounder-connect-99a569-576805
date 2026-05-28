# CoFounder Connect

Production MVP for real-time co-founder matching. Founders create profiles, share live proof URLs, attach pitch deck PDFs, discover compatible founders, match, and message.

## Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Clerk auth pages and middleware protection
- FastAPI backend with SQLAlchemy models
- PostgreSQL via Docker/Supabase-compatible connection string
- Supabase client prepared for storage/database integrations

## Features

- Landing page with founder-specific positioning
- Email/Google-ready auth screens through Clerk
- Protected dashboard
- Profile editor with skills, interests, live URL, and pitch deck preview
- Swipe-style discover cards with compatibility scores
- Matches list
- Realtime-style chat UI and backend message CRUD
- FastAPI auth, profile, discover, swipe, match, message, and pitch deck endpoints

## Run locally

```bash
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:3000
Backend: http://localhost:8000
API health: http://localhost:8000/health

## Manual backend run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Manual frontend run

```bash
cd frontend
npm install
npm run dev
```

## Environment

Set Clerk keys for auth, Supabase URL/key for future storage integration, and `DATABASE_URL` for PostgreSQL. `SECRET_KEY` signs backend JWTs.

# Dopaline - Self-Discipline App

A minimalistic Next.js app that helps users stay disciplined through daily Focus and Body quests, streak tracking, and progressive titles.

## Features

- ✅ Daily Focus and Body quests
- ✅ Streak tracking with progressive titles
- ✅ Calendar view of completion history
- ✅ Quest rerolling (once per quest per day)
- ✅ Motivational quotes and reflection prompts
- ✅ Google OAuth authentication
- ✅ Clean, zen UI with no distractions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (MongoDB Atlas recommended)
- Google OAuth credentials

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dopaline?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. **Set up MongoDB:**

- Create a MongoDB Atlas account or use a local MongoDB instance
- Update `DATABASE_URL` in your `.env` file

4. **Set up Google OAuth:**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your `.env` file

5. **Generate Prisma Client and seed database:**

```bash
npx prisma generate
npm run db:seed
```

6. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
m0nk-next/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   ├── calendar/        # Calendar page
│   ├── profile/         # Profile page
│   └── page.tsx         # Dashboard
├── components/
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── quests.ts        # Quest logic
│   ├── streaks.ts       # Streak calculation
│   └── ...
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
└── proxy.ts             # Route protection
```

## Title Progression

- **Initiate** - Default (0-2 days)
- **Self-Controller** - 3 days
- **Discipline Novice** - 7 days
- **Focus Warrior** - 14 days
- **Mind-Body Knight** - 21 days
- **Dopamine Monk** - 30+ days

## Deploy on Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URI to your production URL
5. Deploy!

## Technologies

- Next.js 16
- TypeScript
- Prisma with MongoDB
- NextAuth.js
- Tailwind CSS
- shadcn/ui
- Lucide React

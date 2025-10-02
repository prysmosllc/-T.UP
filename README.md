# Founder-Investor Matching Platform

A Whop app that connects startup founders with investors through a swipe-based matching interface.

## Features

- 🔐 Whop authentication integration
- 👥 Role-based onboarding (Founder/Investor)
- 💫 Swipe-based discovery interface
- 💬 Real-time matching and chat system
- 📁 File upload for pitch decks
- 🔔 Push notifications
- 🛡️ Admin moderation tools

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Whop SDK
- **Deployment**: Vercel

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Whop Configuration
WHOP_API_KEY="your_whop_api_key"
NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_agent_user_id"
NEXT_PUBLIC_WHOP_APP_ID="your_app_id"
NEXT_PUBLIC_WHOP_COMPANY_ID="your_company_id"

# Supabase Configuration
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### 2. Database Setup

1. Create a new Supabase project
2. Copy the database URL from Supabase dashboard
3. Update the `DATABASE_URL` and `DIRECT_URL` in your environment files
4. Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Development

```bash
npm install
npm run dev
```

### 4. Deployment

The app is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── experiences/         # Main app interface
│   └── globals.css         # Global styles
├── lib/
│   ├── db.ts               # Database client
│   └── whop-sdk.ts         # Whop SDK configuration
├── prisma/
│   └── schema.prisma       # Database schema
└── public/
    └── assets/             # Static assets
```

## Database Schema

The application uses the following main models:

- **Profile**: User profiles (founder/investor)
- **Interaction**: Like/pass actions
- **Match**: Mutual likes between users
- **Thread**: Chat conversations
- **Message**: Individual messages
- **Report**: User reports for moderation

## API Routes

- `/api/profile` - Profile management
- `/api/discovery` - Profile discovery feed
- `/api/interactions` - Like/pass actions
- `/api/matches` - Match management
- `/api/chat` - Messaging system
- `/api/admin` - Admin functions

## Whop Integration

The app integrates with Whop's platform for:

- User authentication via JWT tokens
- Experience access validation
- File uploads for pitch decks
- Push notifications for matches/messages
- Deep linking to chat threads

## Development Workflow

1. **Requirements**: Defined in `.kiro/specs/founder-investor-matching/requirements.md`
2. **Design**: Technical architecture in `.kiro/specs/founder-investor-matching/design.md`
3. **Tasks**: Implementation plan in `.kiro/specs/founder-investor-matching/tasks.md`

## Contributing

1. Follow the task list in the specs directory
2. Implement one task at a time
3. Test thoroughly before moving to next task
4. Update documentation as needed
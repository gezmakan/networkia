# Networkia

A modern Next.js application with dark mode support, Prisma ORM, and Neon database.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **Prisma** - Type-safe ORM
- **Neon** - Serverless PostgreSQL database
- **NextAuth.js v5** - Authentication with Google OAuth

## Features

- 🌙 Dark mode support with CSS variables
- 🔐 Google OAuth authentication
- 📊 PostgreSQL database with Prisma
- 🎨 Tailwind CSS v4 for styling
- 🔒 Type-safe database queries
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database account ([sign up here](https://neon.tech))
- Google OAuth credentials ([get them here](https://console.cloud.google.com/apis/credentials))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values:

```bash
# Get your Neon database URL
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your_generated_secret"

# Add your Google OAuth credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

3. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to your database
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Database Setup

### Using Neon

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string
4. Add it to `.env.local` as `DATABASE_URL`

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create a migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to `.env.local`

## Project Structure

```
networkia/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/         # NextAuth API routes
│   ├── auth/             # Auth pages
│   │   └── signin/       # Sign in page
│   ├── globals.css       # Global styles with dark mode
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                   # Shared utilities
│   └── prisma.ts         # Prisma client singleton
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── auth.ts               # NextAuth configuration
├── middleware.ts         # NextAuth middleware
└── next.config.ts        # Next.js configuration
```

## Dark Mode

The app uses CSS variables for theme management:

- Theme is stored in localStorage
- Persists across page reloads
- Toggle button in the UI
- Can be extended to save theme preference to user profile in database

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT

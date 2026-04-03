# Deployment Guide - Solution Challenge Website

## Prerequisites

- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Supabase, or Neon recommended)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database
3. Copy the connection string (use "Connection pooling" for production)

### Option C: Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard

## Step 2: Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Auth.js (REQUIRED)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# OAuth Providers (OPTIONAL - for Google/GitHub login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Social Media Links (OPTIONAL)
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/gdgpennstate"
NEXT_PUBLIC_GITHUB_URL="https://github.com/gdgpennstate"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/company/gdgpennstate"
NEXT_PUBLIC_YOUTUBE_URL="https://youtube.com/@gdgpennstate"
```

### Generate AUTH_SECRET

Run this command locally:
```bash
openssl rand -base64 32
```

## Step 3: Deploy to Vercel

### Via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to link your project

### Via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy

## Step 4: Database Migration

After first deployment, run migrations:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Functions
3. Or use Vercel CLI:

```bash
vercel env pull .env.local
npm run db:push
npm run db:seed
```

## Step 5: Post-Deployment Setup

### 1. Test Admin Login

- Email: `rva5573@psu.edu`
- Password: `RajAwinashe@17`

**IMPORTANT**: Change this password immediately in production!

### 2. Update Social Links

Set your actual social media URLs in environment variables or update the defaults in `components/footer.tsx`

### 3. Add Your Logo

Replace the Google logo with your custom logo:
- Update `components/navbar.tsx` (GDGLogo component)
- Update `components/hero-section.tsx` (GoogleLogo component)
- Update `components/footer.tsx` (GoogleG component)

### 4. Configure OAuth (Optional)

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

## Step 6: Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

## Troubleshooting

### Build Fails

- Check that `DATABASE_URL` is set correctly
- Ensure Prisma can connect to your database
- Check build logs for specific errors

### Auth Not Working

- Verify `AUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure OAuth redirect URIs are correct

### Database Connection Issues

- Verify connection string format
- Check database is accessible from Vercel's region
- Use connection pooling for PostgreSQL

## Maintenance

### Update Database Schema

```bash
# Make changes to prisma/schema.prisma
npm run db:push
```

### Re-seed Database

```bash
npm run db:seed
```

### View Database

```bash
npm run db:studio
```

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong `AUTH_SECRET`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Review OAuth redirect URIs
- [ ] Set up database backups
- [ ] Monitor error logs

## Support

For issues, contact: gdg@psu.edu

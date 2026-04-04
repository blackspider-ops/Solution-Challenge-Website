# Scripts Documentation

All scripts have been updated to work with both PostgreSQL (production) and SQLite (local development) through the unified `lib/db.ts` instance.

## Available Scripts

### Database Management

#### Generate Prisma Client
```bash
npm run db:generate
```
Generates the Prisma Client based on your schema. Run this after any schema changes.

#### Run Migrations
```bash
npm run db:migrate
```
Creates and applies database migrations in development.

#### Push Schema
```bash
npm run db:push
```
Pushes schema changes directly to the database without creating migrations (useful for prototyping).

#### Prisma Studio
```bash
npm run db:studio
```
Opens Prisma Studio - a visual database browser.

### Seeding

#### Seed Main Data
```bash
npm run db:seed
```
Seeds the database with:
- Admin account (rva5573@psu.edu)
- Tracks
- FAQs
- Timeline events
- Sponsors

**Note:** This script uses the `DATABASE_URL` from your environment. Make sure it's set correctly.

#### Seed Registration Form
```bash
npm run db:seed-form
```
Seeds the registration form with 17 questions across 5 sections:
- Basic Info
- Team Formation
- Food & Dietary
- T-Shirt
- Agreements

### Admin Management

#### Create Production Admin
```bash
npx tsx scripts/create-production-admin.ts
```
Creates the default admin account:
- Email: rva5573@psu.edu
- Password: RajAwinashe@17

**Important:** Change the password after first login!

#### Create Custom Admin
```bash
npx tsx scripts/create-admin.ts <email> <name> [password]
```
Creates or promotes a user to admin role.

**Examples:**
```bash
npx tsx scripts/create-admin.ts admin@example.com "Admin User" mypassword123
npx tsx scripts/create-admin.ts existing@user.com "Existing User"  # Promotes existing user
```

#### Check Admin Status
```bash
npx tsx scripts/check-admin.ts
```
Checks if the default admin account exists and displays its status.

### Track Management

#### Enable All Tracks
```bash
npx tsx scripts/enable-all-tracks.ts
```
Makes all tracks visible to participants. Useful before the event starts.

## Environment Setup

### Local Development (SQLite)
```bash
DATABASE_URL="file:./prisma/dev.db"
```

### Production (PostgreSQL/Neon)
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Running Scripts with Environment Variables

If a script doesn't pick up your `.env.local` file, you can explicitly load it:

```bash
export $(cat .env.local | xargs) && npx tsx scripts/your-script.ts
```

## Common Workflows

### Initial Setup (Local Development)
```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Run migrations
npm run db:migrate

# 3. Seed database
npm run db:seed
npm run db:seed-form
```

### Initial Setup (Production)
```bash
# 1. Ensure DATABASE_URL is set to your Neon database
# 2. Generate Prisma Client
npm run db:generate

# 3. Push schema (migrations are already in git)
npm run db:push

# 4. Create admin account
npx tsx scripts/create-production-admin.ts

# 5. Seed data
npm run db:seed
npm run db:seed-form

# 6. Enable tracks when ready
npx tsx scripts/enable-all-tracks.ts
```

### Reset Database (Local)
```bash
# Delete the database file
rm prisma/dev.db

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
npm run db:seed-form
```

## Troubleshooting

### "PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions"
This means the DATABASE_URL environment variable is not set. Make sure your `.env.local` file exists and contains the correct DATABASE_URL.

### "The Driver Adapter is not compatible with the provider"
This means there's a mismatch between your DATABASE_URL and the Prisma schema provider. Ensure:
- PostgreSQL URLs start with `postgresql://` or `postgres://`
- SQLite URLs start with `file:`
- The `provider` in `prisma/schema.prisma` matches your database type

### Scripts not finding environment variables
Use the explicit environment loading:
```bash
export $(cat .env.local | xargs) && npx tsx scripts/your-script.ts
```

## Script Architecture

All scripts now use the unified `lib/db.ts` instance which:
- Automatically detects PostgreSQL vs SQLite based on DATABASE_URL
- Uses the appropriate adapter (@prisma/adapter-pg or @prisma/adapter-better-sqlite3)
- Provides a single `db` export for all database operations

This ensures consistency across all scripts and the main application.

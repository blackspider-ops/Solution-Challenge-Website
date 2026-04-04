# Solution Challenge Website Documentation

Complete documentation for the Solution Challenge 2026 event website.

## 📚 Documentation Files

### Essential Guides

1. **[README.md](README.md)** (this file)
   - Overview and quick links
   - Getting started guide

2. **[DEPLOYMENT.md](DEPLOYMENT.md)** ⭐ **Start here for deployment**
   - Complete Vercel deployment guide
   - Neon PostgreSQL setup
   - Vercel Blob configuration
   - Environment variables
   - OAuth setup
   - Troubleshooting

3. **[FEATURES.md](FEATURES.md)**
   - All implemented features
   - How each feature works
   - Configuration details

4. **[FORM_BUILDER.md](FORM_BUILDER.md)**
   - Registration form system
   - Admin panel usage
   - Question types
   - Conditional logic
   - Response management

### Technical Documentation

5. **[MIGRATION_COMPARISON.md](MIGRATION_COMPARISON.md)**
   - SQLite vs PostgreSQL comparison
   - Migration verification
   - Database schema details

6. **[AUTOFILL_FEATURE.md](AUTOFILL_FEATURE.md)**
   - Name/email autofill implementation
   - Technical details

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev
npm run db:seed-form

# Start dev server
npm run dev
```

Visit: http://localhost:3000

### Deploy to Production

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete guide.

Quick steps:
1. Create Neon database in Vercel
2. Create Vercel Blob storage
3. Add environment variables
4. Run migrations
5. Push to GitHub (auto-deploys)

## 🎯 Key Features

✅ **Registration Form** - 17 questions, 5 sections, localStorage persistence  
✅ **File Uploads** - Resume uploads to Vercel Blob  
✅ **QR Tickets** - Generation and email delivery  
✅ **OAuth Login** - Google + GitHub  
✅ **Admin Panel** - Form builder, response viewer, CSV export  
✅ **Email System** - Automated notifications via Resend  
✅ **Team Formation** - Up to 4 members per team  
✅ **Project Submission** - Track-based submissions  
✅ **Check-in System** - QR code scanning  

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Neon PostgreSQL (prod), SQLite (dev)
- **File Storage**: Vercel Blob
- **Auth**: NextAuth.js v5
- **Email**: Resend
- **Styling**: Tailwind CSS + shadcn/ui
- **ORM**: Prisma 7

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (participant)/     # Participant routes
│   ├── (auth)/            # Auth routes
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── dashboard/        # Participant components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── actions/          # Server actions
│   ├── auth.ts           # Auth configuration
│   ├── db.ts             # Database client
│   ├── email.ts          # Email utilities
│   └── blob.ts           # File upload utilities
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration history
│   └── seed-form.ts      # Form seeder
└── docs/                 # Documentation
```

## 📝 Environment Variables

Required for production:

```bash
# Database (auto-set by Vercel)
DATABASE_URL=${POSTGRES_PRISMA_URL}

# File Storage (auto-set by Vercel)
BLOB_READ_WRITE_TOKEN=your-token

# Auth
NEXTAUTH_URL=https://solutionchallenge.gdgpsu.dev
NEXTAUTH_SECRET=your-secret

# Email
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=Solution Challenge <noreply@gdgpsu.dev>

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## 🐛 Common Issues

### Build Fails
- Ensure `postinstall: "prisma generate"` in package.json
- Check all environment variables are set

### Database Connection Fails
- Verify `DATABASE_URL` is set to `${POSTGRES_PRISMA_URL}`
- Check Neon database is created

### File Upload Fails
- Verify Vercel Blob storage is created
- Check `BLOB_READ_WRITE_TOKEN` is set

### OAuth Fails
- Update redirect URIs to include production URL
- Verify `NEXTAUTH_SECRET` is set

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.

## 📊 Database Schema

**18 Tables:**
- Auth: Account, Session, VerificationToken, User
- Event: Registration, Ticket, CheckIn
- Competition: Track, Team, TeamMember, Submission
- Content: Announcement, Sponsor, FAQ, TimelineEvent
- Forms: FormSection, FormQuestion, FormResponse, FormAnswer

See [MIGRATION_COMPARISON.md](MIGRATION_COMPARISON.md) for details.

## 🎉 Ready to Deploy?

Follow the **[DEPLOYMENT.md](DEPLOYMENT.md)** guide!

## 📞 Support

For issues:
1. Check the documentation files
2. Review Vercel deployment logs
3. Check Prisma schema for database structure
4. Review error messages in browser console

## 🔗 Useful Links

- **Production**: https://solutionchallenge.gdgpsu.dev
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Dashboard**: https://console.neon.tech
- **Resend Dashboard**: https://resend.com/emails
- **Google OAuth**: https://console.cloud.google.com/apis/credentials
- **GitHub OAuth**: https://github.com/settings/developers

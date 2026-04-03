# Solution Challenge - GDG Penn State

A comprehensive hackathon management platform built for the Google Developer Groups Solution Challenge at Penn State University.

## 🚀 Features

### For Participants
- **Event Registration** - Simple registration with QR code ticket generation
- **Team Management** - Create or join teams (up to 4 members) with invite codes
- **Project Submission** - Submit projects with repo, demo, and video URLs
- **Announcements** - View real-time announcements from organizers
- **Track Selection** - Choose from 6 UN SDG-aligned challenge tracks

### For Admins
- **Registration Management** - View, search, and manage all registrations
- **QR Check-in** - Scan QR codes via camera or manual entry
- **Team Overview** - Monitor all teams and their members
- **Submission Review** - View and evaluate project submissions
- **Announcement System** - Post updates visible to all participants
- **Track Visibility Control** - Show/hide track detail pages

### For Volunteers
- **Check-in Access** - Perform participant check-ins at event entrance

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Prisma ORM (SQLite dev / PostgreSQL prod)
- **Authentication**: Auth.js v5 (NextAuth)
- **Forms**: react-hook-form + Zod validation
- **Animations**: Framer Motion
- **QR Codes**: qrcode + @zxing/browser

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (for production)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## 🏃 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd solution-challenge-website
npm install
```

### 2. Environment Setup

Create a `.env` file (use `.env.example` as template):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (admin account, tracks, FAQs, sponsors)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login as Admin

- Email: `rva5573@psu.edu`
- Password: `RajAwinashe@17`

**⚠️ Change this password immediately in production!**

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel with PostgreSQL.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/solution-challenge-website)

1. Click the button above
2. Add environment variables (see DEPLOYMENT.md)
3. Deploy
4. Run database migrations
5. Change admin password

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Login, register pages
│   ├── (participant)/       # Participant dashboard
│   ├── (admin)/             # Admin dashboard
│   ├── (volunteer)/         # Volunteer check-in
│   └── api/                 # API routes (Auth.js)
├── components/              # React components
│   ├── ui/                  # shadcn/ui primitives
│   ├── admin/               # Admin-specific components
│   └── dashboard/           # Participant dashboard components
├── lib/                     # Utilities and configurations
│   ├── actions/             # Server actions
│   ├── schemas/             # Zod validation schemas
│   ├── auth.ts              # Auth.js configuration
│   ├── db.ts                # Prisma client
│   ├── event-config.ts      # Event dates and timeline
│   └── tracks-data.ts       # Track definitions
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts              # Database seed script
└── public/                  # Static assets
```

## 🔐 Authentication

The platform supports three authentication methods:

1. **Email/Password** - Traditional credentials
2. **Google OAuth** - Sign in with Google
3. **GitHub OAuth** - Sign in with GitHub

### Setting Up OAuth

See [DEPLOYMENT.md](./DEPLOYMENT.md) for OAuth configuration instructions.

## 🎨 Customization

### Update Event Details

Edit `lib/event-config.ts`:
```typescript
export const EVENT_START = new Date("2026-04-11T19:00:00-04:00");
export const EVENT_END = new Date("2026-04-12T12:00:00-04:00");
```

### Update Track Prompts

Edit `lib/tracks-data.ts` and update the `promptContent` field for each track.

### Replace Logos

Update these components with your custom logo:
- `components/navbar.tsx` - `GDGLogo()` function
- `components/hero-section.tsx` - `GoogleLogo()` function  
- `components/footer.tsx` - `GoogleG()` function

### Update Sponsors

Sponsors are managed in the database. Use Prisma Studio or seed file:
```bash
npm run db:studio
```

## 📊 Database Models

Key models:
- `User` - Participants, volunteers, admins
- `Registration` - Event registrations
- `Ticket` - QR code tickets
- `CheckIn` - Check-in records
- `Team` - Participant teams
- `Track` - Challenge tracks
- `Submission` - Project submissions
- `Announcement` - Admin announcements
- `Sponsor` - Event sponsors

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Prisma Issues

```bash
# Regenerate Prisma client
npm run db:generate
```

## 📝 Recent Fixes

See [FIXES_APPLIED.md](./FIXES_APPLIED.md) for a detailed list of recent bug fixes and improvements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

Google Developer Groups at Penn State
- Email: gdg@psu.edu
- Website: [Your website]
- Twitter: [@gdgpennstate](https://twitter.com/gdgpennstate)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Animations by [Framer Motion](https://www.framer.com/motion)
- Hosted on [Vercel](https://vercel.com)

---

Made with ❤️ by GDG Penn State

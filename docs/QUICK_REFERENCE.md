# Quick Reference Guide

## 🔑 Default Credentials

### Admin Account
- **Email**: `rva5573@psu.edu`
- **Password**: `RajAwinashe@17`
- **⚠️ CHANGE IMMEDIATELY IN PRODUCTION**

## 🌐 Important URLs

### Local Development
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Participant Dashboard**: http://localhost:3000/dashboard
- **Database Studio**: Run `npm run db:studio`

### Production (After Deployment)
- **Frontend**: https://your-domain.vercel.app
- **Admin Panel**: https://your-domain.vercel.app/admin

## 📧 Contact Email

All contact forms and mailto links point to: **gdg@psu.edu**

Update in these files if needed:
- `components/hero-section.tsx`
- `components/footer.tsx`
- `components/sponsors-section.tsx`

## 🗓️ Event Details

### Dates & Times
- **Start**: April 11, 2026 @ 7:00 PM ET
- **Team Formation**: April 11, 2026 @ 8:00 PM ET
- **Submission Deadline**: April 12, 2026 @ 10:00 AM ET
- **Judging**: April 12, 2026 @ 12:00 PM ET

### Location
**ECoRE Building, University Park, PA**

### Source of Truth
All dates defined in: `lib/event-config.ts`

## 🎯 Challenge Tracks

1. Health & Wellbeing
2. Climate Action
3. Quality Education
4. Peace & Justice
5. Reduced Inequalities
6. Innovation & Infrastructure

**Edit prompts**: `lib/tracks-data.ts`

## 🏆 Sponsors

### Current Sponsors (in database)
- **Platinum**: Google
- **Gold**: Schreyer Honors College
- **Silver**: Utree

### Manage Sponsors
```bash
npm run db:studio
# Navigate to Sponsor table
```

Or edit seed file: `prisma/seed.ts`

## 🔧 Common Commands

### Development
```bash
npm run dev              # Start dev server
npm run db:studio        # Open database GUI
npm run db:seed          # Reseed database
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
```

### Production
```bash
npm run build            # Build for production
npm run start            # Start production server
```

## 📁 Key Files to Edit

### Event Configuration
- `lib/event-config.ts` - Event dates and timeline
- `lib/tracks-data.ts` - Track definitions and prompts

### Branding
- `components/navbar.tsx` - Top navigation logo
- `components/hero-section.tsx` - Hero section logo
- `components/footer.tsx` - Footer logo

### Content
- `prisma/seed.ts` - Initial data (FAQs, sponsors, etc.)
- `components/faq-section.tsx` - FAQ display
- `components/sponsors-section.tsx` - Sponsors display

### Styling
- `app/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind configuration

## 🔐 Environment Variables

### Required (Production)
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="https://your-domain.com"
```

### Optional (OAuth)
```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Optional (Social Links)
```env
NEXT_PUBLIC_TWITTER_URL="..."
NEXT_PUBLIC_GITHUB_URL="..."
NEXT_PUBLIC_LINKEDIN_URL="..."
NEXT_PUBLIC_YOUTUBE_URL="..."
```

## 🚨 Troubleshooting

### "Database not found"
```bash
npm run db:push
npm run db:seed
```

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "Build fails on Vercel"
- Check DATABASE_URL is set
- Check AUTH_SECRET is set
- Check build logs for specific errors

### "Auth not working"
- Verify AUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure OAuth redirect URIs are correct

### "QR codes not generating"
- Check `qrcode` package is installed
- Check browser console for errors
- Verify ticket has valid qrToken

## 📊 Database Schema

### User Roles
- `participant` - Default role for registered users
- `volunteer` - Can perform check-ins
- `admin` - Full access to admin panel

### Registration Status
- `pending` - Initial state
- `confirmed` - Approved registration
- `waitlisted` - On waitlist

### Submission Status
- `draft` - Work in progress
- `submitted` - Final submission
- `reviewed` - Judged by admins

## 🎨 Color Scheme

### Track Colors
- **Health & Wellbeing**: Rose/Pink (`rose-500`, `pink-500`)
- **Climate Action**: Emerald/Teal (`emerald-500`, `teal-500`)
- **Quality Education**: Blue/Indigo (`blue-500`, `indigo-500`)
- **Peace & Justice**: Purple/Violet (`purple-500`, `violet-500`)
- **Reduced Inequalities**: Orange/Amber (`orange-500`, `amber-500`)
- **Innovation & Infrastructure**: Cyan/Sky (`cyan-500`, `sky-500`)

### Sponsor Tiers
- **Platinum**: Violet (`violet-500`)
- **Gold**: Amber (`amber-500`)
- **Silver**: Slate (`slate-400`)

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Auth.js Docs](https://authjs.dev)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## 📞 Support

**Email**: gdg@psu.edu

**Documentation**:
- `README.md` - General overview
- `DEPLOYMENT.md` - Deployment guide
- `FIXES_APPLIED.md` - Recent fixes
- `TODO.md` - Remaining tasks
- `QUICK_REFERENCE.md` - This file

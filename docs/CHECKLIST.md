# Pre-Launch Checklist

## 📋 Before Deployment

### Content Updates
- [ ] Update track prompts in `lib/tracks-data.ts`
  - [ ] Health & Wellbeing
  - [ ] Climate Action
  - [ ] Quality Education
  - [ ] Peace & Justice
  - [ ] Reduced Inequalities
  - [ ] Innovation & Infrastructure
- [ ] Set social media URLs in `.env` or `components/footer.tsx`
  - [ ] Twitter/X
  - [ ] GitHub
  - [ ] LinkedIn
  - [ ] YouTube
- [ ] Decide on logo strategy (keep GDG or replace)
- [ ] Review FAQ content in `prisma/seed.ts`
- [ ] Review sponsor information

### Local Testing
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run db:generate` to generate Prisma client
- [ ] Run `npm run db:push` to create database
- [ ] Run `npm run db:seed` to seed initial data
- [ ] Run `npm run dev` and test locally
- [ ] Test registration flow
- [ ] Test login (email/password)
- [ ] Test admin login
- [ ] Test team creation
- [ ] Test QR code generation
- [ ] Test all navigation links
- [ ] Test responsive design (mobile, tablet, desktop)

## 🚀 Deployment

### Vercel Setup
- [ ] Create Vercel account
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`

### Database Setup
- [ ] Choose database provider (Vercel Postgres recommended)
- [ ] Create PostgreSQL database
- [ ] Copy `DATABASE_URL` connection string
- [ ] Test database connection

### Environment Variables
- [ ] Set `DATABASE_URL` in Vercel
- [ ] Generate `AUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set `AUTH_SECRET` in Vercel
- [ ] Set `NEXTAUTH_URL` to your domain
- [ ] Set OAuth credentials (if using)
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `GITHUB_CLIENT_ID`
  - [ ] `GITHUB_CLIENT_SECRET`
- [ ] Set social media URLs (optional)
  - [ ] `NEXT_PUBLIC_TWITTER_URL`
  - [ ] `NEXT_PUBLIC_GITHUB_URL`
  - [ ] `NEXT_PUBLIC_LINKEDIN_URL`
  - [ ] `NEXT_PUBLIC_YOUTUBE_URL`

### Deploy
- [ ] Run `vercel` to deploy
- [ ] Wait for deployment to complete
- [ ] Note the deployment URL

### Post-Deployment Database Setup
- [ ] Pull environment variables: `vercel env pull .env.local`
- [ ] Run migrations: `npm run db:push`
- [ ] Seed database: `npm run db:seed`
- [ ] Verify database has data

## ✅ Post-Deployment

### Security
- [ ] Login to admin panel
- [ ] Change admin password immediately
- [ ] Test new password works
- [ ] Consider creating additional admin accounts
- [ ] Review user roles and permissions

### Testing
- [ ] Test registration flow on production
- [ ] Test login (email/password)
- [ ] Test OAuth login (Google, GitHub)
- [ ] Test admin panel access
- [ ] Test QR code generation
- [ ] Test QR code scanning (use real phone)
- [ ] Test team creation
- [ ] Test team joining with invite code
- [ ] Test project submission
- [ ] Test announcement creation
- [ ] Test track visibility toggle
- [ ] Test all email links (mailto)
- [ ] Test all social media links
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Content Verification
- [ ] Verify event dates are correct (April 11-12, 2026)
- [ ] Verify event location is correct
- [ ] Verify contact email is correct
- [ ] Verify sponsor information is correct
- [ ] Verify FAQ content is accurate
- [ ] Verify track descriptions are correct
- [ ] Verify timeline is accurate

### Performance
- [ ] Check page load times
- [ ] Test with slow network connection
- [ ] Verify images load correctly
- [ ] Check for console errors
- [ ] Test database query performance

## 📱 Pre-Event

### Communication
- [ ] Send registration confirmation emails
- [ ] Prepare event day announcements
- [ ] Test announcement system
- [ ] Prepare check-in instructions for volunteers

### Volunteer Training
- [ ] Train volunteers on QR code scanning
- [ ] Provide admin/volunteer credentials
- [ ] Test check-in process with volunteers
- [ ] Prepare troubleshooting guide

### Participant Preparation
- [ ] Send event details to registered participants
- [ ] Send QR code ticket instructions
- [ ] Send team formation guidelines
- [ ] Send submission guidelines
- [ ] Send track information (if released)

### Technical Preparation
- [ ] Set up monitoring/alerts
- [ ] Prepare backup plan for technical issues
- [ ] Test on event WiFi network (if possible)
- [ ] Prepare offline backup of participant list
- [ ] Test QR scanner in event lighting conditions

## 🎯 Event Day

### Morning Setup
- [ ] Verify website is accessible
- [ ] Verify admin panel is accessible
- [ ] Test QR code scanner
- [ ] Verify volunteer accounts work
- [ ] Check database connection
- [ ] Prepare check-in station

### During Event
- [ ] Monitor check-ins
- [ ] Post announcements as needed
- [ ] Monitor team formation
- [ ] Monitor submissions
- [ ] Be available for technical support

### Track Release (8:00 PM)
- [ ] Release track detail pages via admin panel
- [ ] Post announcement about track release
- [ ] Verify tracks are visible to participants

### Submission Deadline (10:00 AM)
- [ ] Post reminder announcement
- [ ] Monitor submission count
- [ ] Close submissions at deadline

### Judging (12:00 PM)
- [ ] Export submissions for judges
- [ ] Provide judge access if needed

## 📊 Post-Event

### Data Collection
- [ ] Export all registrations
- [ ] Export all teams
- [ ] Export all submissions
- [ ] Export check-in data
- [ ] Backup database

### Analysis
- [ ] Review registration numbers
- [ ] Review check-in rate
- [ ] Review team formation stats
- [ ] Review submission rate
- [ ] Gather feedback

### Follow-up
- [ ] Send thank you emails
- [ ] Announce winners
- [ ] Share event photos/highlights
- [ ] Prepare for regional round

## 🔧 Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Review database performance
- [ ] Update dependencies
- [ ] Backup database regularly
- [ ] Monitor disk space usage

### Security Updates
- [ ] Keep Next.js updated
- [ ] Keep Prisma updated
- [ ] Keep Auth.js updated
- [ ] Review security advisories
- [ ] Rotate secrets periodically

## 📞 Emergency Contacts

- **Technical Support**: [Your contact]
- **Database Issues**: [Database provider support]
- **Vercel Support**: [Vercel support]
- **Event Organizer**: gdg@psu.edu

## 📚 Quick Links

- **Admin Panel**: https://your-domain.vercel.app/admin
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Database Dashboard**: [Your database provider]
- **Documentation**: See README.md, DEPLOYMENT.md, QUICK_REFERENCE.md

---

**Last Updated**: [Current Date]
**Event Date**: April 11-12, 2026
**Status**: Pre-Launch

Good luck with your Solution Challenge! 🚀

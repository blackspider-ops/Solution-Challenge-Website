# Solution Challenge - GDG Penn State

A comprehensive hackathon management platform for the Google Developer Groups Solution Challenge at Penn State University.

## 🚀 Quick Start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Visit http://localhost:3000

## ✨ Key Features

**For Participants:**
- Registration with QR code tickets
- Team formation (up to 4 members)
- Project submissions with track selection
- Room/hacking space booking
- Real-time announcements

**For Admins:**
- Complete event management dashboard
- QR code check-in system
- Food distribution tracking (3 meal types)
- Room/space management
- Announcement system with email notifications
- Submission controls (open/close, lock edits)

**For Judges:**
- Aggregate scoring system
- Multiple criteria with weighted scores
- Individual judge comments
- Real-time score updates

**For Volunteers:**
- Check-in scanning
- Food distribution management

## 🔒 Security Features

- Role-based access control (participant, volunteer, admin, judge)
- Super admin controls for critical settings
- Input validation and sanitization
- Race condition prevention with transactions
- XSS protection
- Backend validation for all submissions

## 📚 Documentation

See `/docs` folder for detailed documentation:
- [Features](./docs/FEATURES.md) - Complete feature list
- [Deployment](./docs/DEPLOYMENT.md) - Deploy to production
- [Scripts](./docs/SCRIPTS.md) - Database seeding and utilities
- [Security Audit](./docs/SECURITY_AUDIT_REPORT.md) - Security analysis
- [Final Audit](./docs/FINAL_AUDIT_REPORT.md) - Production readiness

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Email:** Resend
- **Styling:** Tailwind CSS
- **QR Codes:** qrcode, @zxing/browser

## 📧 Contact

Google Developer Groups at Penn State - gdg@psu.edu

---

Made with ❤️ by GDG Penn State

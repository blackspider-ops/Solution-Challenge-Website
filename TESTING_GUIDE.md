# Testing Guide - Start Fresh

## 🚀 Quick Test (5 minutes)

### 1. Start the Development Server
```bash
npm run dev
```

Wait for: `✓ Ready in X.Xs`

### 2. Open Your Browser
Go to: http://localhost:3000

You should see the homepage with:
- Solution Challenge 2026 header
- "Register Now" button
- Event details (April 11-12, 2026)
- Tracks section
- Sponsors section
- FAQ section

### 3. Test Registration Flow

**Step 1: Create Account**
- Click "Register Now" or "Login" in navbar
- Click "Sign Up" tab
- Fill in:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123!
- Click "Sign Up"
- You'll be redirected to homepage

**Step 2: Register for Event**
- Click "Dashboard" in navbar
- Click "Register for the event" button
- Modal opens with 2 steps:
  
  **Step 1: External Form**
  - Click "Open Form" (opens Microsoft Form in new tab)
  - Check "I have completed the form"
  
  **Step 2: Generate Ticket**
  - Click "Complete Registration"
  - Wait for success message
  - You'll see your QR code ticket!

**Step 3: View Your Ticket**
- Go to Dashboard → Ticket
- You should see:
  - Your name and email
  - QR code
  - Download button
  - Email Me button
  - Add to Wallet button

### 4. Test Email System

**Check if email was sent:**
- Look at terminal where `npm run dev` is running
- You should see: "Ticket email sent: [email-id]"
- If you see "RESEND_API_KEY not set - skipping email", that's fine (email is configured but won't send in dev)

**Test manual resend:**
- On ticket page, click "Email Me"
- Check terminal for confirmation

### 5. Test Admin Panel

**Login as Admin:**
- Logout (click your name → Logout)
- Login with:
  - Email: rva5573@psu.edu
  - Password: RajAwinashe@17

**Test Admin Features:**
- Go to `/admin` - You should see admin dashboard
- Click "Registrations" - See your test registration
- Click "Content" - Try editing a track description
- Click "Tracks" - Toggle track visibility
- Click "Check-in" - Try scanning (allow camera access)

### 6. Test Team Creation

**As Participant:**
- Login as your test user
- Go to Dashboard → Team
- Click "Create Team"
- Enter team name: "Test Team"
- Click "Create Team"
- You'll see your team with invite code

**Test Team Joining:**
- Logout
- Create another test account
- Go to Dashboard → Team
- Click "Join Team"
- Enter the invite code from first user
- Click "Join Team"

### 7. Test Submission

**As Team Member:**
- Go to Dashboard → Submission
- Fill in:
  - Project Name: Test Project
  - Description: This is a test
  - Repository URL: https://github.com/test/test
  - Demo URL: https://test.com
  - Video URL: https://youtube.com/test
- Click "Submit Project"
- You should see success message

---

## ✅ What Should Work

### Homepage
- ✅ Loads without errors
- ✅ Shows correct event date (April 11-12, 2026)
- ✅ Shows 6 tracks
- ✅ Shows sponsors (Google, Schreyer, Utree)
- ✅ Shows FAQs
- ✅ Social media links work

### Authentication
- ✅ Sign up with email/password
- ✅ Login with email/password
- ✅ Logout
- ✅ Session persists on refresh

### Registration
- ✅ Register for event button appears
- ✅ Modal opens with external form link
- ✅ QR ticket generates
- ✅ Ticket displays on dashboard

### Dashboard
- ✅ Shows registration status
- ✅ Shows ticket with QR code
- ✅ Team creation/joining works
- ✅ Submission form works
- ✅ Announcements display

### Admin Panel
- ✅ Admin can login
- ✅ View all registrations
- ✅ Edit content (tracks, sponsors, FAQs)
- ✅ Toggle track visibility
- ✅ QR code scanner works
- ✅ Create announcements

### Email System
- ✅ Configured with Resend API key
- ✅ Logs email sending in terminal
- ✅ Ready for production use

---

## 🐛 If Something Doesn't Work

### Server won't start
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### Database errors
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Can't login as admin
```bash
# Check admin exists
npm run db:seed
```

### Build errors
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### TypeScript errors
```bash
# Regenerate Prisma client
npm run db:generate
```

---

## 📊 Quick Verification Checklist

Run through this in 5 minutes:

- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Can create new account
- [ ] Can register for event
- [ ] QR ticket generates
- [ ] Can view ticket on dashboard
- [ ] Can login as admin (rva5573@psu.edu / RajAwinashe@17)
- [ ] Admin panel loads at /admin
- [ ] Can edit content at /admin/content
- [ ] Can create team
- [ ] Can submit project
- [ ] No console errors in browser

---

## 🎯 What You Need to Do Before Launch

### 1. Update Track Prompts (30 minutes)

**File:** `lib/tracks-data.ts`

Find each track and replace:
```typescript
promptContent: "🔒 Challenge prompt will be released..."
```

With actual challenge description:
```typescript
promptContent: "Build a solution that addresses [specific problem]..."
```

After editing:
```bash
npm run db:seed
```

### 2. Test Everything Again (15 minutes)

Run through the testing guide above one more time.

### 3. Deploy to Vercel (30 minutes)

Follow: `docs/DEPLOYMENT.md`

### 4. Change Admin Password (5 minutes)

After deployment:
- Login as admin
- Go to profile/settings
- Change password
- Never use RajAwinashe@17 in production!

---

## 📚 Documentation

All docs are in `/docs` folder:

- **START_HERE.md** - Quick start
- **DEPLOYMENT.md** - Deploy to Vercel
- **EMAIL_SYSTEM_SETUP.md** - Email details
- **ADMIN_CONTENT_MANAGEMENT.md** - How to manage content
- **REGISTRATION_FLOW.md** - How registration works
- **QUICK_REFERENCE.md** - Quick answers

---

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check terminal where `npm run dev` is running
3. Check the docs folder
4. Email: gdg@psu.edu

---

## ✅ Everything is Ready!

Your platform is fully functional. Just:
1. Test it (5 minutes)
2. Update track prompts (30 minutes)
3. Deploy (30 minutes)
4. Go live! 🚀

**Current Status:**
- ✅ Build passing
- ✅ Database working
- ✅ Email configured
- ✅ All features implemented
- ✅ Documentation complete
- ✅ Pushed to GitHub

**GitHub:** https://github.com/blackspider-ops/Solution-Challenge-Website

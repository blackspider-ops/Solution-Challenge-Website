# Deployment Guide - Vercel with Neon + Blob

Complete guide to deploy Solution Challenge website to production.

## Prerequisites

- Vercel account
- GitHub repository
- Domain: solutionchallenge.gdgpsu.dev

## Step 1: Create Vercel Storage

### 1.1 Neon PostgreSQL Database

1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database"
3. Select "Neon" (Serverless Postgres)
4. Choose region: US East (closest to Penn State)
5. Click "Create"

**Auto-configured variables:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← Use this one
- `POSTGRES_URL_NON_POOLING`

### 1.2 Vercel Blob Storage

1. In Storage tab, click "Create Database"
2. Select "Blob" (File Storage)
3. Choose "Private" (for resume uploads)
4. Click "Create"

**Auto-configured variable:**
- `BLOB_READ_WRITE_TOKEN`

## Step 2: Add Environment Variables

Go to: **Settings → Environment Variables**

Add these (select all environments: Production, Preview, Development):

```bash
# Database (use Neon's POSTGRES_PRISMA_URL)
DATABASE_URL=${POSTGRES_PRISMA_URL}

# Auth
NEXTAUTH_URL=https://solutionchallenge.gdgpsu.dev
NEXTAUTH_SECRET=Hbn/rTdeMhmff0xl0/pai6/uacQKQHw7tv+jtHzOenQ=

# Email
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=Solution Challenge <noreply@gdgpsu.dev>

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Step 3: Run Database Migrations

```bash
# Link to Vercel project
npx vercel link

# Pull environment variables
npx vercel env pull .env.local

# Run migrations on Neon
DATABASE_URL=$(grep POSTGRES_PRISMA_URL .env.local | cut -d '=' -f2- | tr -d '"') \
npx prisma migrate deploy

# Seed form data
DATABASE_URL=$(grep POSTGRES_PRISMA_URL .env.local | cut -d '=' -f2- | tr -d '"') \
npx tsx prisma/seed-form.ts
```

**Expected output:**
- ✓ Migrations applied
- ✓ 5 sections created
- ✓ 17 questions created

## Step 4: Update OAuth Redirect URIs

### Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select OAuth client: `160347604539-gktlm7drgj5p851ntgj6rsld7tt33l3d`
3. Add to **Authorized redirect URIs**:
   ```
   https://solutionchallenge.gdgpsu.dev/api/auth/callback/google
   ```
4. Save

### GitHub OAuth

1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update **Authorization callback URL**:
   ```
   https://solutionchallenge.gdgpsu.dev/api/auth/callback/github
   ```
4. Save

## Step 5: Verify Email Domain

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `gdgpsu.dev`
4. Add DNS records to your domain provider:
   - TXT record (verification)
   - MX records (email delivery)
   - DKIM records (authentication)
5. Wait for verification (5-10 minutes)

## Step 6: Deploy

### Option A: Auto-Deploy (Recommended)

```bash
git add .
git commit -m "Production ready: Neon + Blob + Form Builder"
git push origin main
```

Vercel automatically deploys on push!

### Option B: Manual Deploy

```bash
npx vercel --prod
```

## Step 7: Post-Deployment Testing

### Test Checklist

- [ ] Homepage loads: https://solutionchallenge.gdgpsu.dev
- [ ] Google OAuth login works
- [ ] GitHub OAuth login works
- [ ] Registration form loads (all 5 sections)
- [ ] Resume upload works
- [ ] Form submission succeeds
- [ ] Email ticket received
- [ ] Admin panel accessible: /admin/registration-form
- [ ] Form responses visible
- [ ] CSV export works

## Troubleshooting

### Build Fails

**Error:** "Cannot find module '@prisma/client'"

**Fix:** Ensure `package.json` has:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Fails

**Error:** "Can't reach database server"

**Fix:**
- Check `DATABASE_URL` is set in Vercel
- Should be: `${POSTGRES_PRISMA_URL}`
- Verify Neon database is created

### File Upload Fails

**Error:** "Failed to upload file"

**Fix:**
- Check Vercel Blob storage is created
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Ensure blob is set to "Private"

### OAuth Fails

**Error:** "Redirect URI mismatch"

**Fix:**
- Update redirect URIs in Google/GitHub
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set

### Emails Not Sending

**Error:** "Domain not verified"

**Fix:**
- Verify domain in Resend dashboard
- Check DNS records are added correctly
- Wait for DNS propagation (up to 24 hours)

## Monitoring

### Vercel Dashboard
- Deployment logs
- Function execution times
- Error tracking

### Neon Dashboard
- Database usage (0.5GB limit)
- Connection count
- Query performance

### Resend Dashboard
- Email delivery rate
- Bounce rate
- Spam reports

## Database Limits

**Neon Free Tier:**
- 0.5GB storage (plenty for ~10,000 participants)
- 100 hours compute/month
- Auto-scales to zero when idle

**Vercel Blob Free Tier:**
- 500MB storage
- 5GB bandwidth/month
- Good for ~100 resume uploads

## Security Checklist

- [x] `NEXTAUTH_SECRET` is random and secure
- [x] OAuth secrets not committed to Git
- [x] Database connection string is secret
- [x] Blob storage is private
- [x] Email domain verified
- [x] HTTPS enabled (automatic on Vercel)

## What's Deployed

✅ **Database**: Neon PostgreSQL with 18 tables  
✅ **File Storage**: Vercel Blob for resumes  
✅ **Form System**: 17 questions, localStorage persistence  
✅ **Authentication**: Google + GitHub OAuth  
✅ **Email**: Ticket delivery + admin notifications  
✅ **Admin Panel**: Form builder + response viewer  
✅ **QR Tickets**: Generation + email delivery  

## Rollback Plan

If something goes wrong:

1. **Revert deployment** in Vercel dashboard
2. **Or rollback Git commit**:
   ```bash
   git revert HEAD
   git push
   ```
3. Check logs to identify issue
4. Fix and redeploy

## Success!

Your site is live at: **https://solutionchallenge.gdgpsu.dev** 🎉

Next steps:
- Test all features
- Monitor error logs
- Share with team
- Prepare for event launch

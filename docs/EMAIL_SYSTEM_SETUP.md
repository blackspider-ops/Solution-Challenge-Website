# Email System Setup Guide

## 🎉 Complete Email Integration

Your Solution Challenge platform now has a complete email system powered by Resend!

## ✅ What's Implemented

### 1. Ticket Emails
- **Automatic**: Sent when user registers
- **Manual**: Resend button on ticket page
- **Content**: Beautiful HTML email with QR code
- **Includes**: Event details, QR code image, ticket link

### 2. Announcement Emails
- **Admin Control**: Send announcements to all participants
- **Batch Sending**: Efficient bulk email delivery
- **Professional**: Branded HTML templates

### 3. Email Templates
- Responsive HTML design
- Mobile-friendly
- Branded with Solution Challenge colors
- Includes QR code images
- Professional formatting

## 🚀 Setup Instructions

### Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email
4. Go to API Keys section
5. Create a new API key
6. Copy the key (starts with `re_`)

### Step 2: Configure Environment Variables

Add to your `.env` file:

```env
# Resend API Key (REQUIRED for emails)
RESEND_API_KEY="re_your_actual_api_key_here"

# From Email (REQUIRED)
EMAIL_FROM="Solution Challenge <noreply@yourdomain.com>"

# Base URL (REQUIRED for QR code images in emails)
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### Step 3: Verify Domain (Production Only)

For production, verify your domain in Resend:

1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records as instructed
5. Wait for verification (usually 5-10 minutes)
6. Update `EMAIL_FROM` to use your domain:
   ```env
   EMAIL_FROM="Solution Challenge <noreply@yourdomain.com>"
   ```

**For Development**: You can use Resend's test domain:
```env
EMAIL_FROM="Solution Challenge <onboarding@resend.dev>"
```

### Step 4: Test Email Sending

1. Register a test user
2. Check your email inbox
3. Verify ticket email arrives
4. Click "View Ticket Online" button
5. Test "Email Me" button on ticket page

## 📧 Email Features

### Ticket Email

**Sent When**:
- User completes registration
- User clicks "Email Me" on ticket page

**Contains**:
- Personalized greeting
- QR code image (embedded)
- Event details (date, time, location)
- Token text (for manual entry)
- "View Ticket Online" button
- Instructions for event day

**Template**: Professional HTML with Solution Challenge branding

### Announcement Email

**Sent When**:
- Admin creates announcement and chooses to email
- Admin clicks "Send as Email" on existing announcement

**Contains**:
- Announcement title
- Announcement body
- Solution Challenge branding
- Contact information

**Recipients**: All confirmed registrations

## 🎯 How to Use

### For Participants

**Automatic**:
1. Register for event
2. Receive ticket email immediately
3. Save email or add to wallet

**Manual**:
1. Go to `/dashboard/ticket`
2. Click "Email Me" button
3. Receive ticket email

### For Admins

**Send Announcement Email**:
1. Go to `/admin/announcements`
2. Create new announcement
3. Check "Send as Email" option (if available)
4. Or click "Send as Email" on existing announcement
5. Email sent to all registered participants

## 🔧 Technical Details

### Email Service

**Provider**: Resend
**Library**: `resend` npm package
**File**: `lib/email.ts`

### Functions

```typescript
// Send ticket email
sendTicketEmail(
  email: string,
  name: string,
  qrToken: string
): Promise<{ success: boolean; error?: string }>

// Send announcement email
sendAnnouncementEmail(
  emails: string[],
  title: string,
  body: string
): Promise<{ success: boolean; error?: string }>
```

### Email Templates

**Ticket Email**:
- Responsive HTML
- Embedded QR code image
- Event details card
- Instructions section
- CTA button
- Footer with contact info

**Announcement Email**:
- Clean layout
- Title header
- Body content (preserves whitespace)
- Footer with contact info

### QR Code in Email

QR codes are embedded as images using the API endpoint:
```
https://your-domain.com/api/qr/{token}
```

This ensures QR codes display in all email clients.

## 📊 Email Limits

### Resend Free Tier:
- 100 emails/day
- 3,000 emails/month
- Perfect for testing and small events

### Resend Pro Tier ($20/month):
- 50,000 emails/month
- $1 per 1,000 additional emails
- Recommended for production

## 🐛 Troubleshooting

### Emails Not Sending

**Check**:
1. `RESEND_API_KEY` is set in `.env`
2. API key is valid (starts with `re_`)
3. `EMAIL_FROM` is set correctly
4. Domain is verified (production only)
5. Check server logs for errors

**Test**:
```bash
# Check environment variables
echo $RESEND_API_KEY
echo $EMAIL_FROM

# Check logs
npm run dev
# Register a user and check console output
```

### Emails Going to Spam

**Solutions**:
1. Verify your domain in Resend
2. Add SPF and DKIM records
3. Use a professional from address
4. Avoid spam trigger words
5. Test with different email providers

### QR Code Not Showing in Email

**Check**:
1. `NEXTAUTH_URL` is set correctly
2. QR code API endpoint is accessible
3. Image URL is correct in email HTML
4. Email client supports images

### Rate Limiting

If you hit rate limits:
1. Upgrade Resend plan
2. Batch emails efficiently
3. Add delay between sends
4. Use Resend's batch API

## 🔒 Security

### Best Practices:
- ✅ Never commit API keys to git
- ✅ Use environment variables
- ✅ Verify domain in production
- ✅ Use HTTPS for all links
- ✅ Validate email addresses
- ✅ Rate limit email sending

### Email Validation:
- Emails only sent to registered users
- Email matches session user
- Admin-only for announcements
- No arbitrary email sending

## 📱 Email Clients Tested

✅ Gmail (Web, iOS, Android)
✅ Outlook (Web, Desktop)
✅ Apple Mail (macOS, iOS)
✅ Yahoo Mail
✅ ProtonMail

## 🎓 Example Usage

### Send Ticket Email

```typescript
import { sendTicketEmail } from '@/lib/email';

const result = await sendTicketEmail(
  'user@example.com',
  'John Doe',
  'clxyz123abc'
);

if (result.success) {
  console.log('Email sent!');
} else {
  console.error('Email failed:', result.error);
}
```

### Send Announcement Email

```typescript
import { sendAnnouncementEmail } from '@/lib/email';

const emails = ['user1@example.com', 'user2@example.com'];
const result = await sendAnnouncementEmail(
  emails,
  'Event Reminder',
  'Don\'t forget to bring your laptop!'
);

if (result.success) {
  console.log(`Sent to ${emails.length} recipients`);
}
```

## 📞 Support

### Resend Support:
- Docs: https://resend.com/docs
- Email: support@resend.com
- Discord: https://resend.com/discord

### Your Support:
- Email: gdg@psu.edu

## 🎉 Summary

You now have:
- ✅ Complete email system
- ✅ Automatic ticket emails
- ✅ Manual resend functionality
- ✅ Announcement emails
- ✅ Professional HTML templates
- ✅ QR code embedding
- ✅ Production-ready setup

**Just add your Resend API key and you're ready to go!**

---

**Last Updated**: [Current Date]
**Email Provider**: Resend
**Status**: Production Ready

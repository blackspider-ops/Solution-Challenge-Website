# Registration Flow Documentation

## 🎯 Overview

The Solution Challenge registration system integrates with an external Microsoft Form and generates QR code tickets that can be added to digital wallets.

## 📋 Registration Process

### Step 1: User Authentication
Users must be logged in before registering:
- **Google OAuth** (recommended)
- **GitHub OAuth**
- **Email/Password**

### Step 2: External Form Completion
Users are directed to complete a Microsoft Form:
- **Form URL**: https://forms.office.com/r/EhW4bfqHFR?origin=lprLink
- Opens in new tab
- User confirms completion

### Step 3: Ticket Generation
After form completion:
- QR code ticket is generated
- Ticket uses logged-in email and name
- Ticket is saved to database
- Email is sent with ticket (optional)

### Step 4: Ticket Access
Users can access their ticket at:
- `/dashboard/ticket` - View QR code
- Email - Ticket sent via email
- Wallet - Add to Apple/Google/Samsung Wallet

## 🎫 QR Code Ticket Features

### Display
- User's name and email
- QR code (high error correction)
- Unique token (CUID)
- Registration status
- Check-in status

### Actions
- **Download** - Save as PNG image
- **Email Me** - Resend ticket to email
- **Add to Wallet** - Add to digital wallet

### Wallet Support
- ✅ Apple Wallet (.pkpass)
- ✅ Google Wallet
- ✅ Samsung Wallet
- ✅ Any wallet supporting QR codes

## 🔧 Technical Implementation

### Database Schema
```prisma
model Registration {
  id        String   @id @default(cuid())
  userId    String   @unique
  status    RegistrationStatus @default(pending)
  createdAt DateTime @default(now())
  
  user   User    @relation(...)
  ticket Ticket?
}

model Ticket {
  id             String   @id @default(cuid())
  registrationId String   @unique
  qrToken        String   @unique @default(cuid())
  issuedAt       DateTime @default(now())
  
  registration Registration @relation(...)
  checkIn      CheckIn?
}
```

### Server Actions
**File**: `lib/actions/registration.ts`

```typescript
// Register user for event
registerForEvent(): Promise<{
  error: string
} | {
  data: { id: string; ticketId: string; qrToken: string }
}>

// Get user's registration
getMyRegistration(): Promise<Registration | null>
```

### API Routes

#### Resend Ticket Email
**Endpoint**: `POST /api/ticket/resend`

**Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Ticket sent to your email"
}
```

#### Generate Wallet Pass
**Endpoint**: `GET /api/wallet/pass?token={qrToken}`

**Response**: Wallet pass file or pass data

#### Get QR Code Image
**Endpoint**: `GET /api/qr/{token}`

**Response**: PNG image of QR code

## 📧 Email Integration

### Setup Email Service

The system supports any email service. Examples:

#### Option 1: Resend (Recommended)
```bash
npm install resend
```

```typescript
// In lib/actions/registration.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Solution Challenge <noreply@yourdomain.com>',
  to: email,
  subject: 'Your Solution Challenge Ticket',
  html: generateTicketEmailHTML(name, qrToken),
});
```

#### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@yourdomain.com',
  subject: 'Your Solution Challenge Ticket',
  html: generateTicketEmailHTML(name, qrToken),
});
```

#### Option 3: Nodemailer
```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: 'noreply@yourdomain.com',
  to: email,
  subject: 'Your Solution Challenge Ticket',
  html: generateTicketEmailHTML(name, qrToken),
});
```

### Email Template

Create a ticket email template:

```typescript
function generateTicketEmailHTML(name: string, qrToken: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Solution Challenge Ticket</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Solution Challenge 2026</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Event Ticket</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 18px; color: #111827;">Hi ${name},</p>
          
          <p style="color: #4b5563;">You're registered for Solution Challenge 2026! Here's your QR code ticket:</p>
          
          <div style="background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <img src="${process.env.NEXTAUTH_URL}/api/qr/${qrToken}" alt="QR Code" style="width: 200px; height: 200px;">
            <p style="font-family: monospace; font-size: 12px; color: #6b7280; margin-top: 10px;">${qrToken}</p>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">Event Details</p>
            <p style="margin: 5px 0 0 0; color: #1e3a8a;">
              📅 April 11-12, 2026<br>
              🕖 7:00 PM - 12:00 PM<br>
              📍 ECoRE Building, University Park, PA
            </p>
          </div>
          
          <p style="color: #4b5563;">
            <strong>What to do:</strong><br>
            1. Save this email or screenshot the QR code<br>
            2. Show it at the event entrance<br>
            3. Or add it to your digital wallet for easy access
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/ticket" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              View Ticket Online
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            See you at the event!<br>
            Google Developer Groups at Penn State
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>Google Developer Groups at Penn State<br>
          <a href="mailto:gdg@psu.edu" style="color: #9ca3af;">gdg@psu.edu</a></p>
        </div>
      </body>
    </html>
  `;
}
```

## 📱 Wallet Pass Implementation

### Apple Wallet (.pkpass)

Use the `passkit-generator` library:

```bash
npm install passkit-generator
```

```typescript
import { PKPass } from 'passkit-generator';

async function generateAppleWalletPass(
  name: string,
  email: string,
  qrToken: string
) {
  const pass = await PKPass.from({
    model: './certificates/pass-model',
    certificates: {
      wwdr: './certificates/wwdr.pem',
      signerCert: './certificates/signerCert.pem',
      signerKey: './certificates/signerKey.pem',
    },
  });

  pass.type = 'eventTicket';
  pass.headerFields.push({
    key: 'event',
    label: 'EVENT',
    value: 'Solution Challenge 2026',
  });
  
  pass.primaryFields.push({
    key: 'name',
    label: 'PARTICIPANT',
    value: name,
  });
  
  pass.secondaryFields.push({
    key: 'date',
    label: 'DATE',
    value: 'April 11-12, 2026',
  });
  
  pass.barcodes = [{
    format: 'PKBarcodeFormatQR',
    message: qrToken,
    messageEncoding: 'iso-8859-1',
  }];

  return pass.getAsBuffer();
}
```

### Google Wallet

Use Google Wallet API:

```typescript
import { GoogleAuth } from 'google-auth-library';

async function generateGoogleWalletPass(
  name: string,
  email: string,
  qrToken: string
) {
  const auth = new GoogleAuth({
    keyFile: './google-wallet-key.json',
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const client = await auth.getClient();
  
  // Create event ticket object
  const eventTicket = {
    id: `${process.env.GOOGLE_WALLET_ISSUER_ID}.${qrToken}`,
    classId: `${process.env.GOOGLE_WALLET_ISSUER_ID}.solution-challenge-2026`,
    state: 'ACTIVE',
    barcode: {
      type: 'QR_CODE',
      value: qrToken,
    },
    ticketHolderName: name,
    // ... more fields
  };

  // Generate save URL
  const saveUrl = `https://pay.google.com/gp/v/save/${Buffer.from(JSON.stringify(eventTicket)).toString('base64')}`;
  
  return saveUrl;
}
```

## 🔒 Security

### QR Token Security
- Tokens are CUIDs (cryptographically unique)
- Tokens are unique per ticket
- Tokens cannot be guessed
- Tokens are validated server-side

### Check-in Validation
- QR code is scanned at entrance
- Token is looked up in database
- Duplicate check-ins are prevented
- Check-in is logged with timestamp

### Email Security
- Emails are sent only to registered email
- Email resend requires authentication
- Rate limiting on email resend (TODO)

## 🧪 Testing

### Test Registration Flow

1. **Login**:
   ```
   Visit /login
   Login with Google or test account
   ```

2. **Register**:
   ```
   Visit /dashboard
   Click "Register for the event"
   Complete external form
   Confirm form completion
   Click "Complete Registration"
   ```

3. **View Ticket**:
   ```
   Visit /dashboard/ticket
   Verify QR code displays
   Test download button
   Test email button
   Test wallet button
   ```

4. **Test Check-in**:
   ```
   Visit /admin/checkin (as admin)
   Scan QR code or enter token
   Verify check-in succeeds
   Verify duplicate check-in fails
   ```

### Test QR Code Scanning

Use these tools to test QR codes:
- iPhone Camera app
- Android Camera app
- QR code scanner apps
- Admin check-in scanner

## 📊 Analytics

Track these metrics:
- Registration completion rate
- Form completion rate
- Ticket email open rate
- Wallet pass additions
- Check-in rate

## 🐛 Troubleshooting

### QR Code Not Generating
- Check `qrcode` package is installed
- Check canvas element exists
- Check browser console for errors

### Email Not Sending
- Verify email service credentials
- Check email service logs
- Test with a simple email first

### Wallet Pass Not Working
- Verify certificates are valid (Apple)
- Check API credentials (Google)
- Test with sample pass first

### Check-in Failing
- Verify QR token exists in database
- Check token hasn't been used
- Verify scanner has camera permission

## 📞 Support

For issues:
- Check this documentation
- Review error logs
- Contact: gdg@psu.edu

---

**Last Updated**: [Current Date]
**Version**: 1.0

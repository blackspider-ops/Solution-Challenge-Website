# Security Documentation

## Password Security

### ✅ Password Hashing

All passwords in the system are properly hashed using **bcrypt** with a salt rounds of 12 before being stored in the database.

#### Implementation Details

**Signup Process** (`lib/actions/auth.ts`):
```typescript
const hashed = await bcrypt.hash(password, 12);
await db.user.create({
  data: { name, email, password: hashed, role: "participant" }
});
```

**Login Process** (`lib/auth.ts`):
```typescript
const user = await db.user.findUnique({ where: { email } });
const valid = await bcrypt.compare(password, user.password);
```

**Admin Account Creation** (all scripts):
```typescript
const hashedPassword = await bcrypt.hash(adminPassword, 12);
await db.user.create({
  data: { email, name, role: "admin", password: hashedPassword }
});
```

### Password Requirements

**Validation Schema** (`lib/schemas/auth.ts`):
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number

### Security Best Practices Implemented

1. ✅ **Never store plain text passwords** - All passwords are hashed with bcrypt
2. ✅ **Salt rounds of 12** - Industry standard for bcrypt
3. ✅ **Password validation** - Enforced on both client and server
4. ✅ **Secure comparison** - Using bcrypt.compare() for timing-attack resistance
5. ✅ **OAuth support** - Google and GitHub OAuth as alternatives to passwords

## Authentication Security

### Session Management

- **Strategy**: JWT (JSON Web Tokens)
- **Provider**: NextAuth.js v5
- **Adapter**: Prisma Adapter for database sessions

### Role-Based Access Control (RBAC)

Three user roles with different permissions:

1. **Participant** (default)
   - Access to dashboard
   - Can register for event
   - Can form/join teams
   - Can submit projects

2. **Volunteer**
   - All participant permissions
   - Can check-in participants via QR scanner

3. **Admin**
   - All volunteer permissions
   - Full access to admin panel
   - Can manage users, content, and settings

### Protected Routes

**Admin Routes** (`lib/admin-guard.ts`):
```typescript
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}
```

**Middleware Protection** (`middleware.ts`):
- Automatic role-based redirects
- Session validation on every request
- Protected API routes

## Data Security

### Database Security

1. **Prisma ORM** - Prevents SQL injection
2. **Parameterized queries** - All queries use Prisma's type-safe API
3. **Connection pooling** - Neon PostgreSQL with connection pooling
4. **Environment variables** - Sensitive credentials in .env files

### File Upload Security

**Vercel Blob Storage**:
- Private blob storage for resume uploads
- File type validation (PDF, DOC, DOCX only)
- File size limit (5MB max)
- Secure URL generation

### API Security

1. **Server Actions** - All mutations use Next.js Server Actions
2. **Input Validation** - Zod schemas for all inputs
3. **Error Handling** - Generic error messages (no sensitive data leaks)
4. **Rate Limiting** - Contact form limited to 3 messages/hour per IP

## OAuth Security

### Google OAuth
- Client ID and Secret stored in environment variables
- Testing mode (up to 100 test users)
- Proper redirect URI configuration

### GitHub OAuth
- Client ID and Secret stored in environment variables
- Proper callback URL configuration

### Microsoft OAuth (Azure AD)
- Client ID, Secret, and Tenant ID stored in environment variables
- Azure AD tenant-specific authentication
- Proper redirect URI configuration
- Supports organizational and personal Microsoft accounts

### OAuth Flow Security
- State parameter for CSRF protection
- Secure token exchange
- Automatic account linking prevention

## Environment Variables

### Required Secrets

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
AUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-domain.com

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
AZURE_AD_CLIENT_ID=...
AZURE_AD_CLIENT_SECRET=...
AZURE_AD_TENANT_ID=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=...

# File Storage
BLOB_READ_WRITE_TOKEN=...
```

### Secret Management

- ✅ Never commit secrets to git
- ✅ Use `.env.local` for local development
- ✅ Use Vercel environment variables for production
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/staging/production

## Security Checklist

### ✅ Completed

- [x] Password hashing with bcrypt
- [x] Secure session management
- [x] Role-based access control
- [x] Protected routes and API endpoints
- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React)
- [x] CSRF protection (NextAuth)
- [x] Secure file uploads
- [x] Environment variable management
- [x] OAuth implementation
- [x] Rate limiting on contact form

### 🔄 Recommended for Production

- [ ] Enable HTTPS only (Vercel handles this automatically)
- [ ] Set up Content Security Policy (CSP) headers
- [ ] Enable Vercel's DDoS protection
- [ ] Set up monitoring and alerting
- [ ] Regular security audits
- [ ] Implement 2FA for admin accounts
- [ ] Add password reset functionality
- [ ] Implement account lockout after failed attempts
- [ ] Add audit logging for admin actions

## Incident Response

### If a Security Issue is Discovered

1. **Immediate Actions**:
   - Rotate all affected credentials
   - Review access logs
   - Notify affected users if data was compromised

2. **Investigation**:
   - Identify the vulnerability
   - Assess the impact
   - Document the incident

3. **Remediation**:
   - Fix the vulnerability
   - Deploy the fix
   - Verify the fix works

4. **Prevention**:
   - Update security documentation
   - Add tests to prevent regression
   - Review similar code for same issue

## Contact

For security concerns, contact: gdg@psu.edu

**Do not** disclose security vulnerabilities publicly until they have been addressed.

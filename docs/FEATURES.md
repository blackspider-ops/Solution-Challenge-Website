# Features Documentation

Complete overview of all implemented features.

## 🎯 Core Features

### 1. Registration Form System

**Dynamic form builder with 17 pre-configured questions:**

- 5 sections: Basic Info, Team Formation, Food & Dietary, T-Shirt, Agreements
- 7 question types: text, textarea, email, select, radio, checkbox, file
- Conditional logic (show/hide questions based on answers)
- Auto-save to localStorage (no database calls until submit)
- Autofill name and email from user account
- Resume upload to Vercel Blob storage
- Progress tracking with visual indicators

**Admin Features:**
- Create/edit/delete sections and questions
- Reorder sections and questions
- Toggle active/inactive
- Set conditional logic
- View all responses
- Search and filter responses
- Export to CSV
- Email notifications on submission

### 2. Authentication System

**OAuth Providers:**
- Google OAuth (Client ID: 160347604539...)
- GitHub OAuth (Client ID: Ov23liJp8sdVC1kQPRzW)
- Email/password (bcrypt hashed)

**Features:**
- Session management with NextAuth.js v5
- Role-based access (participant, volunteer, admin)
- Automatic session refresh
- Sign out with session clearing

### 3. QR Ticket System

**Ticket Generation:**
- Unique QR code per participant
- Email delivery with ticket
- Mobile-optimized HTML ticket page
- "Add to Wallet" button (mobile wallet integration)
- Print/download options

**Check-in System:**
- QR code scanner for volunteers/admins
- One-time check-in per ticket
- Check-in history tracking
- Performer tracking (who scanned)

### 4. Email System (Resend)

**Automated Emails:**
- Registration confirmation with QR ticket
- Admin notification on form submission
- Announcement broadcasts
- Contact form submissions

**Email Templates:**
- Branded HTML templates
- Responsive design
- QR code embedded
- Event details included

**Configuration:**
- Domain: gdgpsu.dev
- From: Solution Challenge <noreply@gdgpsu.dev>
- API Key: re_RsGwSLyu_BZE66tJ6JN9NJUhiPvnG2eaz

### 5. File Upload System

**Vercel Blob Integration:**
- Private blob storage
- Resume uploads (PDF, DOC, DOCX)
- 5MB file size limit
- File validation
- Progress indicators
- URL storage in database

**Supported Formats:**
- PDF (application/pdf)
- Word (application/msword)
- Word (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

### 6. Admin Panel

**Content Management:**
- Tracks: Edit descriptions, prompts, visibility
- Sponsors: Add/edit/remove sponsors
- FAQs: Manage FAQ items
- Announcements: Create and publish announcements

**Registration Management:**
- View all registrations
- Search and filter
- Check-in status
- Export data

**Form Builder:**
- Visual form editor
- Question management
- Response viewer
- Analytics dashboard
- CSV export

**Team Management:**
- View all teams
- Team members
- Track assignments
- Invite codes

**Submission Management:**
- View project submissions
- Filter by track
- Review status
- Links to repos/demos

**User Management:**
- View all users with registration status
- Search by name or email
- Filter by role (admin, volunteer, participant)
- Filter by registration status
- Grant admin/volunteer access
- Role change with confirmation
- User statistics dashboard
- Prevent self-demotion

### 7. Team System

**Team Formation:**
- Create team (up to 4 members)
- Invite code system (6-char uppercase)
- Join existing team
- Leave team
- Track selection

**Team Features:**
- Team leader designation
- Member management
- Track assignment
- One team per user
- Team name uniqueness

### 8. Project Submission

**Submission Form:**
- Project title and description
- Repository URL
- Demo URL
- Video URL
- Track assignment

**Status Tracking:**
- Draft (editable)
- Submitted (locked)
- Reviewed (admin marked)

### 9. Announcement System

**Features:**
- Create announcements
- Pin important announcements
- Publish/unpublish
- Rich text content
- Timestamp tracking

**Display:**
- Dashboard widget (latest 5)
- Full announcements page
- Pinned at top
- Author attribution

### 10. Track System

**Challenge Tracks:**
- Multiple tracks (e.g., Health, Education, Environment)
- Detailed descriptions
- Challenge prompts
- Visibility control (hide until event start)
- Custom icons and gradients

**Track Pages:**
- Individual track detail pages
- Full challenge description
- Prompt content
- Team listings

## 🎨 UI/UX Features

### Design System
- Tailwind CSS + shadcn/ui components
- Dark mode support
- Responsive design (mobile-first)
- Smooth animations
- Loading states
- Error handling

### Navigation
- Sticky navbar
- Role-based menu items
- Active link highlighting
- Mobile hamburger menu

### Forms
- Real-time validation
- Error messages
- Success toasts
- Loading indicators
- Auto-save indicators

## 🔒 Security Features

### Authentication
- Secure password hashing (bcrypt)
- JWT token encryption
- Session management
- CSRF protection
- OAuth state validation

### Authorization
- Role-based access control
- Admin-only routes
- User-scoped data
- Protected API routes

### Data Protection
- SQL injection prevention (Prisma)
- XSS protection (React)
- Private file storage
- Environment variable secrets
- HTTPS enforcement

## 📊 Data Management

### Database (Neon PostgreSQL)
- 18 tables
- Relational data model
- Foreign key constraints
- Cascade deletes
- Unique constraints
- Indexes for performance

### File Storage (Vercel Blob)
- Private blob storage
- CDN delivery
- Automatic cleanup
- URL-based access

### Caching
- Next.js automatic caching
- Revalidation on mutations
- Optimistic updates

## 🚀 Performance

### Optimizations
- Server-side rendering
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading
- Database connection pooling

### Monitoring
- Vercel Analytics
- Error tracking
- Performance metrics
- Database query monitoring

## 📱 Mobile Support

### Responsive Design
- Mobile-first approach
- Touch-friendly UI
- Optimized forms
- Mobile navigation

### Mobile Features
- QR ticket display
- Wallet integration
- Camera access (QR scanning)
- Touch gestures

## 🔧 Developer Features

### Development Tools
- TypeScript for type safety
- Prisma for database ORM
- ESLint for code quality
- Hot reload
- Error boundaries

### Database Tools
- Prisma Studio (visual editor)
- Migration system
- Seed scripts
- Schema validation

## 📈 Analytics & Reporting

### Admin Analytics
- Total registrations
- Responses today
- Form completion rate
- Team formation stats
- Submission counts

### Export Options
- CSV export (all responses)
- Filterable data
- Timestamp tracking
- User attribution

## 🎯 Event-Specific Features

### Timeline
- Event schedule display
- Status indicators (active, upcoming, completed)
- Countdown timers

### Sponsors
- Tiered sponsor display (Platinum, Gold, Silver)
- Logo display
- Website links
- Order management

### FAQ
- Searchable FAQ section
- Collapsible answers
- Order management
- Publish/unpublish

### Contact
- Contact form with rate limiting (3/hour per IP)
- Email delivery to gdg@psu.edu
- Fallback mailto option
- Spam protection

## 🔄 Data Flow

### Registration Flow
1. User logs in (OAuth or email/password)
2. Fills registration form (saved to localStorage)
3. Submits form (saved to database)
4. Receives QR ticket via email
5. Can generate ticket on demand

### Form Persistence
- Auto-save to localStorage on input change
- Resume from last section
- Single database save on submit
- Clear localStorage after submission

### File Upload Flow
1. User selects file
2. Client validates (type, size)
3. Upload to Vercel Blob
4. Store URL in database
5. Display confirmation

## 📝 Content Management

### Editable Content
- Track descriptions and prompts
- Sponsor information
- FAQ items
- Announcements
- Form questions

### Static Content
- Event dates and times
- Location information
- Social media links
- Branding elements

## 🎉 Ready for Production

All features tested and production-ready!

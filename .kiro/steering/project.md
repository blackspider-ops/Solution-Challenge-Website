# Project Steering

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (New York style)
- Prisma ORM + SQLite (local dev) / PostgreSQL (production)
- Auth.js v5 (NextAuth) for authentication
- react-hook-form + zod for forms and validation

## Core Principles
- Keep existing UI styling and component structure — do not redesign pages unless explicitly asked
- Prefer server-side validation (Zod schemas, server actions)
- Use Server Components by default; add "use client" only when necessary
- Keep components reusable and clean
- Always include clear error states and loading states
- Prioritize secure, production-like implementation

---

## ★ CANONICAL EVENT REQUIREMENTS (source of truth — do not override)

### Branding
- Event name: **Solution Challenge**
- Organizer: **Google Developer Groups On Campus, Penn State**
- Top-left nav / sidebar branding: **Google Developer Groups at Penn State**
- Use Google Developer branding (colors, logo) across the site in a clean, professional way
- Place the Google Developer logo prominently near the main hero/title area where "Solution Challenge" appears
- Do NOT use generic "SC" branding as the primary identity — GDG branding takes precedence

### Event Details
- Date: **April 11** (start) → **April 12** (end)
- Start time: **7:00 PM** (April 11)
- End time: **12:00 PM** (April 12)
- Location: **ECoRE Building, University Park, PA**
- Format: **Two-day hackathon**
- Prize: **Winning teams proceed to the North America regional round held by Google**
- Do NOT mention cash prizes or prize pools anywhere

### Timeline (exact schedule — use these in the timeline section)
1. **Registration** — before the event
2. **Event Kickoff** — April 11, 7:00 PM
3. **Team Formation & Prompts Released** — April 11, 8:00 PM (1 hour after kickoff)
4. **Submission Deadline** — April 12, 10:00 AM (2 hours before judging)
5. **Judging** — April 12, 12:00 PM

### Tracks (exactly these six — no additions or removals)
1. Health & Wellbeing
2. Climate Action
3. Quality Education
4. Peace & Justice
5. Reduced Inequalities
6. Innovation & Infrastructure

### Track Page Access Rules
- Every track has its own detail page
- **Before an admin releases tracks**: track detail pages are completely hidden
  - Must NOT be rendered into the public client
  - Must NOT appear in page source
  - Must NOT be accessible via inspect/devtools
  - Server-side protection only — no client-side hiding
  - Public site may show track names/cards, but NOT the detail page content
- **After admin releases tracks**: track detail pages become publicly accessible
- Release mechanism: admin manually flips a switch in the admin panel (per-track or global)
- Track visibility state is stored in the database (`Track.visible` boolean, default `false`)

### Sponsors / Partners
- **Platinum Sponsor**: Google
- **Gold Partner**: Schreyer Honors College
- **Silver Partner**: Utree

### FAQ Rules
- Do NOT mention prizes or prize amounts
- DO mention that winning teams will be sent to the regional round in North America
- Keep FAQ accurate to the event details above

### Contact Actions
- "Become a Sponsor" → `mailto:gdg@psu.edu`
- "Contact Us" → `mailto:gdg@psu.edu`
- Use mailto links or a backend contact form that delivers to gdg@psu.edu

---

## Roles
Three roles exist on the User model:
- `participant` — default role on registration
- `volunteer` — event staff, can perform check-in
- `admin` — full access to all admin features

Route protection lives in `proxy.ts` using Auth.js session checks.

## Admin Account (seeded — never hardcode in frontend)
- Email: `rva5573@psu.edu`
- Password: `RajAwinashe@17`
- Role: `admin`
- Seeded via `prisma/seed.ts` using bcrypt hashing
- Authentication is server-validated only

## Participant Features
- Register for the event
- Create or join a team (up to 4 members, invite code system)
- View QR code ticket for event check-in
- Submit project (title, description, repo URL, demo URL, video URL)
- View submission status
- View published announcements

## Admin Features
- View and manage all registrations
- Check-in participants via QR code scan (manual + camera)
- View and manage teams
- View and manage project submissions
- Post announcements visible to participants
- **Release/hide track detail pages** (per-track toggle)

## Volunteer Features
- Perform participant check-in via QR code scan

---

## File Structure Conventions
- `app/` — Next.js App Router pages and layouts
- `app/api/` — API route handlers (Auth.js, webhooks)
- `app/(auth)/` — login, register pages (unauthenticated)
- `app/(participant)/` — participant dashboard routes (role: participant)
- `app/(admin)/` — admin dashboard routes (role: admin)
- `components/` — shared UI components
- `components/ui/` — shadcn/ui primitives (do not modify)
- `lib/` — utilities, Prisma client, auth config, zod schemas
- `prisma/` — schema.prisma and seed files

## Database Models (Prisma)
Core models:
- `User` — id, email, name, image, role, password, createdAt
- `Account`, `Session`, `VerificationToken` — Auth.js adapter tables
- `Registration` — userId, status (pending | confirmed | waitlisted)
- `Ticket` — registrationId, qrToken (unique)
- `CheckIn` — ticketId (unique), performedBy, checkedInAt
- `Team` — id, name, leaderId, trackId, inviteCode (unique)
- `TeamMember` — teamId, userId (@@unique([userId]) — one team per user)
- `Track` — id, name, description, icon, gradient, order, **visible** (Boolean, default false)
- `Submission` — teamId, trackId, title, description, repoUrl, demoUrl, videoUrl, status
- `Announcement` — id, title, body, published, pinned, createdById
- `Sponsor` — id, name, initial, tier (platinum|gold|silver), logoUrl, websiteUrl, active, order
- `FAQ` — id, question, answer, order, published
- `TimelineEvent` — id, title, date, description, status, order

## Forms and Validation
- All forms use react-hook-form + zod
- Zod schemas live in `lib/schemas/`
- Server actions in `lib/actions/` handle mutations
- Never trust client-side validation alone — always re-validate on the server

## Auth
- Auth.js v5 with Google OAuth + GitHub OAuth + email/password (Credentials provider)
- Session strategy: database sessions
- Protect routes via `proxy.ts`
- Access current user via `auth()` in Server Components

## Error Handling
- Use typed error returns from server actions `{ error: string } | { data: T }`
- Show toast notifications (sonner) for action feedback
- Never expose raw database errors to the client
- All client action handlers wrapped in try/catch for network errors

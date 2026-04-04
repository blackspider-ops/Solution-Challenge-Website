# Registration Form Builder System

A complete form builder system that replaces the external Microsoft Form with an integrated, customizable registration form.

## Features

### Admin Panel (`/admin/registration-form`)

1. **Form Builder Tab**
   - Create, edit, and delete form sections
   - Add questions with multiple types:
     - Short text
     - Long text (textarea)
     - Email
     - Dropdown (select)
     - Radio buttons
     - Checkboxes
     - File upload
   - Configure question properties:
     - Label and description
     - Placeholder text
     - Required/optional
     - Options for select/radio/checkbox
     - Conditional logic (show question based on another answer)
     - Order/sorting
   - Toggle sections and questions active/inactive
   - Drag-and-drop reordering (UI ready)

2. **Responses Tab**
   - View all submitted responses
   - Search by name, email, or answer content
   - Analytics dashboard:
     - Total responses
     - Responses today
     - Total answers
   - View detailed individual responses
   - Export all responses to CSV
   - Automatic email notifications to admin on submission

### Participant Experience (`/dashboard`)

1. **Multi-step Form**
   - Progress bar showing completion percentage
   - Section-by-section navigation
   - Auto-save on each section
   - Form validation
   - Conditional question visibility
   - Resume from where you left off
   - Submit when complete

2. **Integration with Registration**
   - Form must be completed before generating ticket
   - Seamless two-step process:
     1. Complete registration form
     2. Generate QR ticket

## Pre-seeded Form (17 Questions)

The system comes pre-seeded with the 17 questions from the original Microsoft Form:

### Section 1: Basic Information (5 questions)
1. Full Name (text, required)
2. Email Address (email, required)
3. Preferred Pronouns (text, optional)
4. Major (text, required)
5. Academic Year (select, required)

### Section 2: Team Formation (5 questions)
6. Experience level with hackathons (select, required)
7. Do you already have a team? (radio, required)
8. Team members' names and emails (textarea, optional)
9. Skills you bring (checkbox, required)
10. Resume upload (file, optional)

### Section 3: Food & Dietary (2 questions)
11. Dietary restrictions (checkbox, optional)
12. Food allergies (textarea, optional)

### Section 4: T-Shirt & Membership (2 questions)
13. GDG Penn State member? (radio, required)
14. T-Shirt size (select, required)

### Section 5: Agreements & Accessibility (2 questions)
15. Agreements (checkbox, required - MLH Code of Conduct, media consent)
16. Accessibility accommodations (textarea, optional)

## Database Schema

### FormSection
- Organizes questions into logical groups
- Has title, description, order, and active status

### FormQuestion
- Individual form fields
- Supports 7 question types
- Can have conditional logic
- Stores options as JSON for select/radio/checkbox

### FormResponse
- One per user
- Tracks completion status
- Links to user and answers

### FormAnswer
- Individual answer to a question
- Stores value as string (JSON for complex types)
- Unique per question per response

## Email Notifications

When a participant submits the form:
- Admin receives email notification at gdg@psu.edu
- Email includes participant name, email, and submission time
- Link to view response in admin dashboard

## CSV Export

Export includes:
- Participant name and email
- Submission timestamp
- All question labels as columns
- All answers as values
- Handles arrays (checkboxes) and JSON values

## Conditional Logic

Questions can be shown/hidden based on other answers:
- Set "conditionalOn" to another question's ID
- Set "conditionalValue" to the expected answer
- Question only appears if condition is met

Example: "Team members' names" only shows if "Do you have a team?" is "Yes"

## File Uploads

Currently stores file metadata (name, size, type) in the database.

For production, you should:
1. Upload files to cloud storage (S3, Cloudinary, etc.)
2. Store the URL in the answer value
3. Update the file input handler in `registration-form.tsx`

## Customization

### Adding New Question Types

1. Add type to `QuestionType` enum in `schema.prisma`
2. Add handler in `QuestionField` component
3. Update form builder dialog to include new type

### Styling

All components use shadcn/ui and Tailwind CSS. Customize:
- Colors: Update theme in `tailwind.config.ts`
- Layout: Modify component files
- Animations: Add to Tailwind config

## API Routes

All form operations use Server Actions:
- `lib/actions/form-builder.ts` - All CRUD operations
- No API routes needed (uses Next.js Server Actions)

## Security

- All admin operations require `role: "admin"`
- Form responses are user-scoped
- SQL injection protected by Prisma
- XSS protected by React

## Future Enhancements

- Drag-and-drop reordering (UI ready, needs backend)
- Question branching (multiple conditions)
- File upload to cloud storage
- Response analytics (charts, graphs)
- Email templates customization
- Form versioning
- Response editing by participants
- Bulk operations (delete, export filtered)

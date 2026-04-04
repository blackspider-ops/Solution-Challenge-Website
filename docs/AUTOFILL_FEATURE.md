# Autofill Feature - Name & Email

## What Changed

The registration form now automatically fills in the user's name and email from their logged-in account, while still allowing them to edit these fields if needed.

## How It Works

### 1. Data Flow

```
User Account (session)
    ↓
Dashboard Page (gets user.name & user.email)
    ↓
RegisterButton Component (receives as props)
    ↓
RegistrationForm Component (autofills matching questions)
    ↓
User can edit if needed
```

### 2. Matching Logic

The form automatically detects and fills:

**Name Field:**
- Questions with label containing "full name" (case-insensitive)
- Questions with label exactly "name" (case-insensitive)

**Email Field:**
- Questions with type "email"
- Questions with label containing "email" (case-insensitive)

### 3. Visual Indicators

Autofilled fields have:
- Light blue background (`bg-primary/5`)
- Subtle blue border (`border-primary/20`)
- Label note: "(from your account)"

### 4. User Experience

1. User clicks "Register for the event"
2. Form opens with name and email already filled in
3. User sees "(from your account)" next to autofilled fields
4. Fields have a subtle blue tint
5. User can edit the values if they want to use different information
6. User continues filling out the rest of the form

## Example

When "John Doe" (john.doe@psu.edu) opens the registration form:

```
Full Name *                    (from your account)
┌─────────────────────────────────────────────┐
│ John Doe                                    │  ← Autofilled, editable
└─────────────────────────────────────────────┘

Email Address *                (from your account)
┌─────────────────────────────────────────────┐
│ john.doe@psu.edu                            │  ← Autofilled, editable
└─────────────────────────────────────────────┘

Preferred Pronouns
┌─────────────────────────────────────────────┐
│                                             │  ← Empty, user fills
└─────────────────────────────────────────────┘
```

## Code Changes

### Files Modified

1. **components/dashboard/registration-form.tsx**
   - Added `userName` and `userEmail` props
   - Auto-populate logic in initial state
   - Visual indicators for autofilled fields
   - "(from your account)" label

2. **components/dashboard/register-button.tsx**
   - Added `userName` and `userEmail` props
   - Pass props to RegistrationForm

3. **app/(participant)/dashboard/page.tsx**
   - Pass `session.user.name` and `session.user.email` to RegisterButton

## Benefits

✅ Faster registration - users don't retype information  
✅ Fewer errors - data comes from verified account  
✅ Still flexible - users can edit if needed  
✅ Clear indication - users know where data came from  
✅ Better UX - subtle visual feedback  

## Edge Cases Handled

- **No name in account**: Field remains empty, user fills manually
- **No email in account**: Field remains empty, user fills manually
- **Already answered**: Existing answers take precedence over autofill
- **Multiple name/email fields**: All matching fields get autofilled
- **OAuth accounts**: Works with Google/GitHub account data

## Testing

To test the feature:

1. Login with an account that has name and email
2. Go to `/dashboard`
3. Click "Register for the event"
4. Check that name and email are pre-filled
5. Verify you can edit the values
6. Check the visual indicators (blue tint, label note)
7. Submit the form and verify it saves correctly

## Future Enhancements

Potential improvements:
- Autofill other fields from user profile (major, year, etc.)
- Remember previous form answers for similar events
- Import data from LinkedIn/resume
- Suggest corrections based on common patterns

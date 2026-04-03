# Admin Content Management Guide

## 🎉 New Feature: Live Content Management

You can now manage ALL website content directly from the admin panel without touching any code! Changes are live immediately.

## 📍 Access

**URL**: `/admin/content`

**Navigation**: Admin Panel → Content (in sidebar)

## 🎯 What You Can Manage

### 1. Track Content ✏️

Edit all track information:
- **Track Name** - Display name
- **Short Description** - Shown on homepage track cards
- **Full Description** - Shown on track detail pages
- **Challenge Prompt** - The actual challenge participants work on

**How to use**:
1. Go to Admin Panel → Content → Tracks tab
2. Click "Edit" on any track
3. Update the content
4. Click "Save"
5. Changes are live immediately!

**Track Visibility**:
- Use Admin Panel → Tracks to show/hide track detail pages
- Hidden tracks return 404 for non-admin users
- Admins can always preview hidden tracks

### 2. Sponsors 🏆

Manage event sponsors:
- Add new sponsors
- Edit existing sponsors
- Delete sponsors
- Show/hide sponsors
- Set sponsor tier (Platinum, Gold, Silver)
- Add website URLs
- Control display order

**How to add a sponsor**:
1. Go to Admin Panel → Content → Sponsors tab
2. Click "Add Sponsor"
3. Fill in:
   - Name (required) - e.g., "Google"
   - Initial (required) - e.g., "G" (1-2 letters)
   - Tier (required) - Platinum, Gold, or Silver
   - Display Order - Controls position (0 = first)
   - Logo URL (optional) - Direct link to logo image
   - Website URL (optional) - Sponsor's website
4. Click "Create"
5. Sponsor appears on homepage immediately!

**How to edit a sponsor**:
1. Click the edit icon (pencil) on any sponsor
2. Update fields
3. Click "Save"

**How to hide a sponsor**:
- Click the eye icon to toggle visibility
- Hidden sponsors don't appear on the website

**How to delete a sponsor**:
- Click the trash icon
- Confirm deletion

### 3. FAQs ❓

Manage frequently asked questions:
- Add new FAQs
- Edit existing FAQs
- Delete FAQs
- Show/hide FAQs
- Control display order

**How to add an FAQ**:
1. Go to Admin Panel → Content → FAQs tab
2. Click "Add FAQ"
3. Fill in:
   - Question (required)
   - Answer (required)
   - Display Order - Controls position (0 = first)
4. Click "Create"
5. FAQ appears on homepage immediately!

**How to edit an FAQ**:
1. Click the edit icon (pencil) on any FAQ
2. Update question or answer
3. Click "Save"

**How to hide an FAQ**:
- Click the eye icon to toggle visibility
- Hidden FAQs don't appear on the website

**How to delete an FAQ**:
- Click the trash icon
- Confirm deletion

## 🚀 Changes Are Live Immediately

All changes you make in the admin panel are:
- ✅ **Instant** - No deployment needed
- ✅ **Live** - Visible to users immediately
- ✅ **Persistent** - Saved in the database
- ✅ **Reversible** - You can edit or delete anytime

## 📊 Display Order

All content types support display order:
- **Lower numbers appear first** (0, 1, 2, 3...)
- You can use any numbers (0, 10, 20, 30...)
- Gaps are fine (0, 5, 100...)
- Negative numbers work too (-1, 0, 1...)

**Example**:
```
Order 0: First item
Order 1: Second item
Order 2: Third item
Order 10: Fourth item
```

## 🎨 Sponsor Tiers

### Platinum
- **Color**: Violet/Purple
- **Size**: Largest cards
- **Position**: Top of sponsors section

### Gold
- **Color**: Amber/Gold
- **Size**: Medium cards
- **Position**: Middle of sponsors section

### Silver
- **Color**: Slate/Gray
- **Size**: Smallest cards
- **Position**: Bottom of sponsors section

## 🔒 Track Visibility Control

**Two separate controls**:

1. **Track Visibility** (Admin → Tracks)
   - Controls if track detail pages are accessible
   - Hidden = 404 for non-admin users
   - Visible = Public can view detail page

2. **Track Content** (Admin → Content)
   - Edit track descriptions and prompts
   - Always editable regardless of visibility
   - Changes apply when track becomes visible

**Workflow**:
1. Edit track content in Content page
2. When ready, make visible in Tracks page
3. Track detail page is now public with your content

## 💡 Best Practices

### Track Prompts
- Be specific about the challenge
- Include success criteria
- Mention any constraints or requirements
- Keep it clear and actionable

**Example**:
```
Build a mobile app that helps underserved communities access 
mental health resources. Your solution should:
- Be accessible to users with limited internet connectivity
- Support multiple languages
- Protect user privacy and data
- Include a way to connect with licensed professionals

Focus on creating a solution that addresses real barriers to 
mental healthcare access.
```

### Sponsors
- Use consistent naming (official company names)
- Add website URLs for clickable cards
- Use single letters for initials (G, S, U)
- Order by importance or alphabetically

### FAQs
- Keep questions concise
- Provide complete answers
- Order by importance (most common questions first)
- Update as new questions arise

## 🔄 Workflow Examples

### Updating Track Prompts Before Event

1. Go to Admin → Content → Tracks
2. Edit each track's "Challenge Prompt" field
3. Save changes
4. Go to Admin → Tracks
5. Release tracks when ready (8:00 PM event day)

### Adding a New Sponsor

1. Go to Admin → Content → Sponsors
2. Click "Add Sponsor"
3. Enter sponsor details
4. Set appropriate tier
5. Click "Create"
6. Sponsor appears on homepage immediately

### Hiding Outdated FAQs

1. Go to Admin → Content → FAQs
2. Find the FAQ to hide
3. Click the eye icon
4. FAQ is hidden from public view
5. Can be shown again anytime

## 🎯 Common Tasks

### Update All Track Prompts
**Time**: 15-30 minutes

1. Admin → Content → Tracks tab
2. Edit each track one by one
3. Update "Challenge Prompt" field
4. Save each track
5. Done! Prompts are live

### Add Multiple Sponsors
**Time**: 5 minutes per sponsor

1. Admin → Content → Sponsors tab
2. Click "Add Sponsor" for each
3. Fill in details
4. Set display order (0, 1, 2, 3...)
5. Create each sponsor

### Reorganize FAQ Order
**Time**: 5-10 minutes

1. Admin → Content → FAQs tab
2. Edit each FAQ
3. Change "Display Order" numbers
4. Save each FAQ
5. FAQs reorder automatically

## 🚨 Important Notes

### Database Changes
- All changes are saved to the database
- Changes persist across deployments
- No code changes needed
- No git commits needed

### Caching
- Changes are live immediately
- Next.js automatically revalidates pages
- Users see updates on next page load
- No manual cache clearing needed

### Permissions
- Only admins can access content management
- Participants and volunteers cannot edit content
- Changes are logged with admin user ID

### Backups
- Database is backed up automatically (if using Vercel Postgres)
- Consider exporting data before major changes
- Use Prisma Studio to view/backup data: `npm run db:studio`

## 🔧 Troubleshooting

### Changes Not Appearing?
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if item is marked as "Hidden" or "Inactive"
3. Verify you clicked "Save"
4. Check browser console for errors

### Can't Edit Content?
1. Verify you're logged in as admin
2. Check your role in the database
3. Try logging out and back in

### Sponsor Not Showing?
1. Check if "Active" is enabled (eye icon)
2. Verify display order is set
3. Check if tier is correct
4. Hard refresh the homepage

### FAQ Not Appearing?
1. Check if "Published" is enabled (eye icon)
2. Verify display order is set
3. Hard refresh the homepage

## 📱 Mobile Editing

The admin panel works on mobile devices:
- Responsive design
- Touch-friendly buttons
- Works on tablets and phones
- Same features as desktop

## 🎓 Training Volunteers

If volunteers need to help with content:
1. Create volunteer admin accounts
2. Show them this guide
3. Walk through each section
4. Let them practice on test content
5. Monitor their changes initially

## 📞 Support

If you need help:
- Check this guide first
- Try the troubleshooting section
- Contact: gdg@psu.edu

## 🎉 Summary

You now have complete control over:
- ✅ Track descriptions and prompts
- ✅ Sponsors (add/edit/delete)
- ✅ FAQs (add/edit/delete)
- ✅ All without touching code!

**Everything is live immediately after saving!**

---

**Last Updated**: [Current Date]
**Feature Version**: 1.0
**Admin Panel**: /admin/content

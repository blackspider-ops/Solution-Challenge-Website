# Judging System Documentation

## Overview

The judging system allows designated judges to score and evaluate team submissions based on configurable criteria. Admins have full access to the judge panel and can manage judging criteria.

## Features

### For Admins
- **Judging Criteria Management**: Create, edit, and configure scoring criteria
  - Set criteria name, description, max score, and weight
  - Activate/deactivate criteria
  - View judging statistics
- **User Role Management**: Assign judge role to users
- **Full Judge Access**: Admins can access the judge panel to score submissions

### For Judges
- **Submission Scoring**: View and score all submitted projects
- **Criteria-based Evaluation**: Score each submission on multiple criteria
- **Comments**: Add optional feedback for each criterion
- **Progress Tracking**: See which submissions have been scored
- **Weighted Scoring**: Automatic calculation of weighted total scores

## Database Schema

### New Models

#### JudgingCriteria
- `id`: Unique identifier
- `name`: Criteria name (e.g., "Innovation", "Technical Complexity")
- `description`: What this criteria evaluates
- `maxScore`: Maximum score (default: 10)
- `weight`: Multiplier for final score calculation (default: 1.0)
- `order`: Display order
- `active`: Whether criteria is currently active

#### JudgingScore
- `id`: Unique identifier
- `submissionId`: Reference to submission
- `judgeId`: Reference to judge user
- `criteriaId`: Reference to criteria
- `score`: Score value (0 to maxScore)
- `comment`: Optional feedback text
- Unique constraint: One score per judge per criteria per submission

### Updated Models

#### User
- Added `judgingScores` relation

#### Submission
- Added `scores` relation to JudgingScore

#### Role Enum
- Added `judge` role

## Setup Instructions

### 1. Run Database Migration

```bash
npx prisma db push
```

This will:
- Add the `judge` role to the Role enum
- Create the `JudgingCriteria` table
- Create the `JudgingScore` table
- Add necessary relations

### 2. Assign Judge Role

1. Log in as an admin
2. Navigate to `/admin/users`
3. Find the user you want to make a judge
4. Click "Change Role"
5. Select "Judge"

### 3. Configure Judging Criteria

1. Navigate to `/admin/judging-criteria`
2. Click "Add Criteria"
3. Fill in:
   - **Name**: e.g., "Innovation"
   - **Description**: What this evaluates
   - **Max Score**: e.g., 10
   - **Weight**: e.g., 1.5 (for 1.5x multiplier)
4. Repeat for all criteria

Example criteria:
- Innovation (Max: 10, Weight: 1.5)
- Technical Complexity (Max: 10, Weight: 1.0)
- Impact (Max: 10, Weight: 1.5)
- Presentation (Max: 10, Weight: 1.0)

### 4. Judges Can Start Scoring

1. Judges log in and navigate to `/judge` (or click "Judge Panel" from dashboard)
2. View all submitted projects
3. Click "Score" on any submission
4. Enter scores for each criterion
5. Add optional comments
6. Click "Save All Scores"

## Access Control

### Judge Role
- Can access `/judge` panel
- Can view all submitted projects
- Can score submissions on all active criteria
- Can add comments to scores
- Cannot manage criteria or other judges

### Admin Role
- Has all judge permissions
- Can access `/admin/judging-criteria`
- Can create, edit, and delete criteria
- Can assign judge role to users
- Can view all scores from all judges

### Participant Role
- Cannot access judge panel
- Cannot view judging criteria or scores

## API Routes

### Server Actions

#### `lib/actions/judging.ts`
- `getJudgingCriteria()`: Get all criteria
- `createJudgingCriteria(data)`: Create new criteria (admin only)
- `updateJudgingCriteria(id, data)`: Update criteria (admin only)
- `deleteJudgingCriteria(id)`: Delete criteria (admin only)
- `getSubmissionsForJudging()`: Get all submissions with scores
- `submitJudgingScore(data)`: Submit or update a score
- `getSubmissionScores(submissionId)`: Get all scores for a submission
- `getJudgingStats()`: Get judging statistics (admin only)

## Pages

### Admin Pages
- `/admin/judging-criteria`: Manage judging criteria
- `/admin/users`: Assign judge role to users

### Judge Pages
- `/judge`: Main judge panel with all submissions

### Dashboard
- Judges and admins see "Judge Panel" link in quick actions

## Components

### Admin Components
- `JudgingCriteriaManager`: Manage criteria (create, edit, delete, toggle)

### Judge Components
- `SubmissionJudgingCard`: Card for scoring a single submission

## Scoring System

### How Scoring Works

1. Each judge scores each submission on multiple criteria
2. Each criterion has a max score (e.g., 10) and a weight (e.g., 1.5)
3. Final score calculation:
   ```
   Total Score = Σ(score × weight) for all criteria
   Max Possible = Σ(maxScore × weight) for all criteria
   ```

### Example

Criteria:
- Innovation: Max 10, Weight 1.5
- Technical: Max 10, Weight 1.0
- Impact: Max 10, Weight 1.5

Judge scores:
- Innovation: 8 → 8 × 1.5 = 12
- Technical: 9 → 9 × 1.0 = 9
- Impact: 7 → 7 × 1.5 = 10.5

Total: 31.5 / 40 (max possible)

## Security

- Judge guard (`lib/judge-guard.ts`) ensures only judges and admins can access judge panel
- Admin guard ensures only admins can manage criteria
- Database constraints prevent duplicate scores
- Score validation ensures scores are within 0 to maxScore range

## Future Enhancements

Potential improvements:
- Leaderboard showing aggregated scores from all judges
- Export scores to CSV
- Judge assignment (assign specific judges to specific submissions)
- Blind judging (hide team names from judges)
- Score normalization across judges
- Real-time judging progress dashboard

# KarmaFacie Project Checkpoint

Last updated: 24 September 2026

## Project

Project name: KarmaFacie

Local project path:
C:\Users\siddh_tlssmim\Documents\civicquest-india

Current Git branch:
karmafacie-rename

Development approach:
- Build incrementally.
- Preserve existing functionality.
- Test every database/frontend change before moving on.
- Prefer secure server-side/database functions over trusting frontend values.
- Visual/theme redesign is frozen until the feature development is substantially complete.

---

# PRODUCT VISION

KarmaFacie is a Pan-India civic participation platform.

It is NOT intended to be only a government complaint/reporting app.

Core product loop:

Learn → Notice → Act → Verify → Earn → Compete → Repeat

Broader journey:

Know → Understand → Participate

Flagship concept:

Hyperlocal, team-based civic participation through Civic Leagues and real-world Civic Missions.

Key concepts:
- Ward/RWA/College/City teams
- Real-world civic missions
- Evidence-based verification
- Karma Credits
- Civic Passport
- Team scoreboards
- Before → After impact records
- Community verification / anti-fraud
- School/youth participation through private partnerships
- Private business/sponsor rewards may later be connected to Karma Credits

Government API dependency is intentionally avoided.

Smart Handoff remains the approach for government complaint submission.

---

# EXISTING FUNCTIONALITY

Completed/working before Civic League feature:

- Authentication + profiles
- English / Hindi / Marathi multilingual UI
- Civic Learning
- Know India interactive map
- State Spotlight
- Civic Quests:
  - Constitution
  - Governance
  - Elections
  - Know India
- Persistent quest progress
- Dashboard
- Report Issue
- My Issues
- Community
- My Impact
- Authority Directory
- Issue status journey
- Submission Gateway
- Resolution verification architecture

---

# BRAND

Official brand:
KarmaFacie

Important:
- Do not globally rename technical identifiers such as:
  civic_issues
  civic_issue_submissions
  civic_quest_progress
  civicquest_admins
  existing technical routes/keys
- Visual themes and final naming refinements are postponed until feature development is complete.

---

# CIVIC LEAGUES

Database foundation created.

Tables:

public.civic_leagues

public.civic_league_teams

public.civic_league_members

public.civic_missions

public.civic_mission_completions

public.civic_points_ledger

Important fields:

civic_league_members uses:
is_active

NOT:
active

League membership must be created through:

public.join_civic_league(uuid, uuid)

Direct authenticated SELECT is allowed where required.

Excess authenticated privileges such as:
REFERENCES
TRIGGER
TRUNCATE

were removed from application-facing league tables.

---

# PILOT LEAGUE

League:

KarmaFacie Pilot Civic League

League type:
city

League ID:

0a22e94a-26ab-419a-bd40-6db3a7f996ff

Pilot teams:

1. College Pilot Team
   team_type: college
   team_key: pilot-college-01
   locality: Pilot College

2. KarmaFacie Pilot Team
   team_type: city
   team_key: pilot-general
   locality: Pilot

3. Ward Pilot Team
   team_type: ward
   team_key: pilot-ward-01
   locality: Ward 01

Current test account is a member of:
Ward Pilot Team

---

# CIVIC MISSIONS

Five pilot missions:

1. Community Awareness
   type: awareness
   points: 30

2. Public Space Observation
   type: civic_observation
   points: 20

3. Clean Space Mission
   type: cleanup
   points: 50
   evidence_type: before_after
   requires_location: true

4. Green Action
   type: tree_planting
   points: 60

5. Civic Revisit
   type: issue_revisit
   points: 40

All pilot missions currently have:

max_completions_per_user = 1

All are active for the pilot period.

---

# MISSION SUBMISSION ENGINE

Secure function:

public.submit_civic_mission(
  uuid,
  jsonb,
  numeric,
  numeric,
  text,
  text
)

Security:
- SECURITY DEFINER = true
- owner = postgres
- search_path = public

The function:
- Requires authenticated user
- Requires active mission
- Checks mission dates
- Reads evidence requirements from mission metadata
- Requires photo when configured
- Requires location when configured
- Validates evidence photo path
- Requires active league membership
- Derives league_id and team_id from membership
- Enforces max completion limits
- Creates completion as status = submitted

Direct INSERT/UPDATE/DELETE access for authenticated users has been removed from:

public.civic_mission_completions

Users retain SELECT access only.

RLS:
- Users can view own mission completions
- Active admins can view all mission completions

---

# MISSION EVIDENCE STORAGE

Private Supabase storage bucket:

civic-mission-evidence

public = false

Folder pattern for normal mission evidence:

<user_id>/<mission_id>/<filename>

Before/After pattern:

<user_id>/<mission_id>/before/<filename>

<user_id>/<mission_id>/after/<filename>

Storage policies:
- Users can upload to own folder
- Users can read their own evidence
- Users can delete their own evidence
- Active admins can read mission evidence

Admin evidence is accessed through temporary signed URLs.

---

# MISSION VERIFICATION

Secure function:

public.review_civic_mission_completion(
  uuid,
  text,
  text
)

Only active users in:

public.civicquest_admins

can perform verification.

Allowed decisions:
- verified
- rejected

Verification behavior:
- Locks completion row
- Prevents re-review
- Sets reviewed_at
- Sets reviewed_by
- Stores review_note
- When verified:
  - completion status = verified
  - mission points are written to points ledger

Important rule:

Submission does NOT automatically award points.

Verification awards points.

A unique partial index prevents multiple positive verification awards for the same completion.

---

# POINTS LEDGER

Table:

public.civic_points_ledger

Ledger is auditable.

Normal users can:
SELECT only

They cannot directly INSERT/UPDATE/DELETE points.

Points are awarded through trusted verification logic.

Current verified test:

Mission:
Public Space Observation

Mission points:
20

Completion status:
verified

Ledger:
+20

Source:
verification

Current team:
Ward Pilot Team

---

# LEAGUE SCOREBOARD

Secure function:

public.get_civic_league_scoreboard(uuid)

The scoreboard is based on:

- verified Karma Credits
- verified missions
- active members

Current pilot scoreboard:

1. Ward Pilot Team
   Karma Credits: 20
   Verified Missions: 1
   Members: 1

2. College Pilot Team
   Karma Credits: 0
   Verified Missions: 0
   Members: 0

3. KarmaFacie Pilot Team
   Karma Credits: 0
   Verified Missions: 0
   Members: 0

Frontend route:

/leagues

It currently contains:
- Pilot league
- team selection/join
- Civic-Sense Scoreboard
- active mission list

Mission cards are clickable.

---

# MISSION DETAIL

Frontend route:

/leagues/missions/[id]

Working features:
- Mission details
- Points
- Verification requirement
- Evidence photo upload
- Browser location capture
- Notes
- Secure mission submission
- Existing submission status

Example working mission:

Public Space Observation

After submission:
status becomes Submitted

After admin verification:
status becomes Verified

---

# ADMIN MISSION REVIEW

Frontend route:

/admin/mission-review

Purpose:
Review pending civic mission submissions.

Working features:
- Admin authentication check
- Active admin check
- Pending submission list
- Mission information
- Team information
- Citizen ID
- Submission notes
- Location evidence
- Private photo preview using signed URL
- Verify button
- Reject button

Current state:
0 pending submissions after the first mission was verified.

Important:
There is already an existing:

app/admin/page.tsx

The mission-review route was created separately at:

app/admin/mission-review/page.tsx

The current implementation was copied into this route.

---

# CIVIC PASSPORT

Secure function:

public.get_my_civic_passport()

Frontend route:

/civic-passport

Shows:
- Total Karma Credits
- Missions submitted
- Missions verified
- Missions rejected
- Current League
- Current Team
- Civic Journey

Current expected test state:

Karma Credits: 20
Missions submitted: 1
Missions verified: 1
Missions rejected: 0

League:
KarmaFacie Pilot Civic League

Team:
Ward Pilot Team

---

# BEFORE → AFTER IMPACT

Table:

public.civic_mission_impacts

Important fields:

id
completion_id
user_id
league_id
team_id
impact_type
before_photo_path
after_photo_path
before_note
after_note
impact_summary
status
reviewed_at
reviewed_by
review_note
created_at
updated_at

Unique constraint:
one impact record per completion

RLS:
- Users can view own impact
- Active admins can view impact
- No direct authenticated INSERT/UPDATE/DELETE

Secure function:

public.submit_civic_mission_impact(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
)

Function:
- Requires authenticated user
- Requires completion belonging to current user
- Prevents duplicate impact
- Validates before/after paths
- Derives user/league/team from completion
- Supports before_after, observation, revisit, custom

Frontend support has been added to:

/leagues/missions/[id]

For missions with:

metadata.evidence_type = before_after

the page shows:
- Before photo
- Before note
- After photo
- After note
- Impact summary

Admin impact verification function:

public.review_civic_mission_impact(
  uuid,
  text,
  text
)

Admin Impact Review route:

/admin/mission-impact-review

Working features:
- Admin access
- Pending impact count
- Before photo preview
- After photo preview
- Impact summary
- Notes
- Verify impact
- Reject impact

Current state:
0 pending impact submissions.

---

# FIRST END-TO-END TEST COMPLETED

Real test completed successfully.

Flow:

Join Civic League
↓
Join Ward Pilot Team
↓
Open Public Space Observation
↓
Upload genuine civic evidence
↓
Capture location
↓
Submit mission
↓
Submission status = submitted
↓
Admin review
↓
Verify +20
↓
Completion status = verified
↓
Points ledger = +20
↓
Scoreboard = Ward Pilot Team +20
↓
Civic Passport = 20 Karma Credits

This has been verified directly in the database.

---

# CURRENT DATABASE FUNCTIONS

Known relevant functions:

join_civic_league(uuid, uuid)

submit_civic_mission(uuid, jsonb, numeric, numeric, text, text)

review_civic_mission_completion(uuid, text, text)

get_my_civic_passport()

get_civic_league_scoreboard(uuid)

submit_civic_mission_impact(uuid, text, text, text, text, text, text)

review_civic_mission_impact(uuid, text, text)

---

# IMPORTANT SECURITY PRINCIPLES

Never trust frontend-provided:
- user_id
- league_id
- team_id
- points
- reviewer identity

Server/database should derive sensitive values.

Points must come from:
mission configuration + trusted verification

not frontend input.

Mission submission must happen through:
submit_civic_mission()

Points must come from:
review_civic_mission_completion()

Evidence storage remains private.

Admin-only review is enforced through:
civicquest_admins + is_active

---

# SQL MIGRATION HISTORY

Historical project SQL numbering before leagues:
63

League feature numbering/local files began separately.

Important league SQL files created during current development:

001_civic_leagues_foundation.sql
002_civic_leagues_pilot_seed.sql
003_civic_leagues_pilot_missions.sql
004_civic_leagues_join_function.sql
005_civic_leagues_read_permissions.sql
006_civic_leagues_privilege_hardening.sql
007_civic_leagues_fix_join_function.sql
008_civic_missions_secure_submission.sql
009_civic_missions_evidence_storage.sql
010_civic_missions_completion_read_permissions.sql
011_civic_missions_verification.sql
012_civic_missions_admin_rls.sql
013_civic_missions_verify_admin.sql
014_civic_missions_harden_submission.sql
015_civic_missions_admin_evidence_access.sql
016_civic_missions_pilot_completion_limits.sql
017_civic_missions_submission_write_hardening.sql
018_civic_points_ledger_security_check.sql
019_civic_points_ledger_privilege_hardening.sql
020_civic_missions_end_to_end_audit.sql
021_civic_passport_personal_summary.sql
022_civic_leagues_scoreboard.sql
023_civic_mission_before_after_impact.sql
024_civic_mission_impact_submission.sql
025_civic_mission_impact_verification.sql

---

# NEXT DEVELOPMENT PRIORITIES

Remaining flagship features:

1. Civic Leagues refinement
2. Civic Missions refinement
3. Civic Credits / Karma system expansion
4. Civic Passport expansion
5. Before → After impact improvement
6. Civic-Sense scoreboard expansion
7. Community verification
8. Anti-fraud engine
9. School / Youth module
10. Private partner rewards
11. Civic Memory / longitudinal public-space records
12. UX integration into the main KarmaFacie navigation/dashboard

Important:
Build these as one coherent participation engine, not disconnected modules.

Core architecture:

KARMAFACIE
    ↓
USER PROFILE
    ├── LEAGUE
    └── INDIVIDUAL
           ↓
        MISSIONS
           ↓
      CIVIC ACTION
           ↓
   VERIFICATION ENGINE
       ├── CREDITS
       ├── XP
       └── IMPACT
              ↓
       CIVIC PASSPORT

---

# FUTURE ANTI-FRAUD IDEAS

Planned but not yet implemented:

- GPS validation
- Photo metadata/time checks where available
- Submission rate limits
- Duplicate evidence detection
- Peer/community confirmation
- Suspicious activity detection
- Repeat-location validation
- Before/after consistency checks
- Reviewer audit trail
- Fraud reversal entries in points ledger

Do not implement fake/artificial verification.

---

# CURRENT DEVELOPMENT STYLE

User prefers:
- one practical step at a time
- provide complete replacement files when changing frontend code
- avoid unnecessary explanations
- wait for confirmation after each step
- preserve existing working functionality
- verify database schema before assuming column names

When continuing in a new chat:

Say:

"Continue KarmaFacie from the latest checkpoint."

Then upload:
1. latest project ZIP
2. this KARMAFACIE_PROJECT_CHECKPOINT.md

Use the latest ZIP, not an older ZIP, because it contains the actual current source code.

---

# CURRENT CHECKPOINT

Completed and verified:

League
→ Team
→ Mission
→ Evidence
→ Verification
→ Karma Credits
→ Scoreboard
→ Civic Passport
→ Before/After foundation
→ Admin impact review

Next logical feature:
Community verification + anti-fraud architecture.
# ============================================================
# CHECKPOINT 2 � 24 September 2026
# ============================================================

## Development completed since Checkpoint 1

### Civic Leagues
- Pilot league working.
- Team joining working through secure function.
- User successfully joined Ward Pilot Team.

### Civic Missions
- Mission listing working.
- Mission detail pages working.
- Mission cards navigate to mission detail.
- Evidence photo upload working.
- Location capture working.
- Secure mission submission function working.
- Direct authenticated INSERT to mission completions removed.
- Pilot missions limited to one completion per user.

### Mission Verification
- Secure admin verification function created.
- Active admin verification enforced.
- Admin Mission Review page working at:
  /admin/mission-review
- Private mission evidence remains in:
  civic-mission-evidence
- Admins can view private evidence through signed URLs.
- First real mission successfully tested end-to-end.

### Verified Test
Mission:
Public Space Observation

Mission points:
20

Completion:
verified

Team:
Ward Pilot Team

Points ledger:
+20

Ledger source:
verification

This was verified directly in the database.

### Civic Passport
- Secure get_my_civic_passport() function created.
- Frontend route created:
  /civic-passport
- Passport connected to real points ledger.
- Current verified test state:
  20 Karma Credits
  1 mission submitted
  1 mission verified
  0 rejected

### Civic-Sense Scoreboard
- Secure get_civic_league_scoreboard() function created.
- Frontend scoreboard added to:
  /leagues
- Scoreboard is based on verified ledger data.
- Current pilot ranking:
  Ward Pilot Team = 20 credits / 1 verified mission / 1 member
  College Pilot Team = 0 / 0 / 0
  KarmaFacie Pilot Team = 0 / 0 / 0

### Before ? After Impact
Table created:
public.civic_mission_impacts

Secure submission function:
submit_civic_mission_impact()

Secure admin review function:
review_civic_mission_impact()

Frontend support added to:
  /leagues/missions/[id]

Admin impact review route:
  /admin/mission-impact-review

Private evidence remains in:
  civic-mission-evidence

Current state:
Impact foundation working.
Admin impact review page working.
No fake impact submission created.

### Community Verification
Peer verification foundation created.

Table:
public.civic_mission_peer_verifications

Secure function:
submit_civic_mission_peer_verification()

Peer queue function:
get_civic_peer_verification_queue()

Peer evidence security helper:
can_civic_peer_view_mission_evidence()

Peer storage policy:
League peers can view mission evidence

Frontend route:
  /leagues/peer-review

Security rules:
- Users cannot verify their own mission.
- Peer verifier must be an active member of the same league.
- One peer verification per verifier per completion.
- Peer verification is a trust signal only.
- Peer verification does NOT directly award Karma Credits.
- Final Karma Credit award remains controlled by admin verification.

Current peer-review test state:
0 available submissions because the current account only has its own submission.
A second test account is required for a real peer-verification test.

### Git Checkpoint
Checkpoint 1 was committed earlier.

Checkpoint 2 should include:
- latest source code
- KARMAFACIE_PROJECT_CHECKPOINT.md
- all Civic League/Mission/Passport/Scoreboard/Impact/Peer Verification work completed so far

Current branch:
karmafacie-rename

### Next Development Step
Create a second test account and add it to the pilot league.

Then test:
Second member
? sees another member's mission
? peer confirmation/rejection
? peer signal stored
? no automatic Karma Credit award

After that:
- strengthen anti-fraud engine
- community trust signals
- reviewer controls
- Civic Memory
- school/youth module
- partner rewards
- final UX integration

### Handoff Instructions
When continuing in a new chat:
1. Upload the latest KarmaFacie checkpoint ZIP.
2. Upload/use this checkpoint markdown file if needed.
3. Say:
   "Continue KarmaFacie from Checkpoint 2. Use the uploaded ZIP as the current source code and read KARMAFACIE_PROJECT_CHECKPOINT.md first."

The latest ZIP must always be preferred over older ZIPs.


# User Authentication - Testing Guide

This document provides step-by-step instructions for testing the newly implemented user authentication system.

## Prerequisites

1. **Database Migration Applied**
   ```bash
   psql -U postgres -d linklists -f migration.sql
   ```

2. **OAuth Credentials Configured**
   - Follow instructions in `AUTH_SETUP.md` to set up GitHub and Google OAuth
   - Add credentials to `.env` file

3. **Server Running**
   ```bash
   npm run dev
   ```

## Test Scenarios

### 1. User Registration & Login

#### Test GitHub OAuth
1. Navigate to `http://localhost:4321`
2. Click "Sign in with GitHub"
3. Complete GitHub authorization
4. Verify:
   - You're redirected back to homepage
   - Your profile appears in the header
   - You can access dropdown menu

#### Test Google OAuth
1. Log out (click profile → Sign out)
2. Click "Sign in with Google"
3. Complete Google authorization
4. Verify same as above

### 2. List Creation with Privacy

#### Create Public List
1. While logged in, click "Create New List"
2. Fill in:
   - Title: "Public Test List"
   - Description: "This is a public list"
   - **Do NOT check** "Make this list private"
3. Click "Create List"
4. Verify:
   - List is created successfully
   - No lock icon appears on list card
   - List appears on homepage when logged out

#### Create Private List
1. While logged in, click "Create New List"
2. Fill in:
   - Title: "Private Test List"
   - Description: "This is a private list"
   - **CHECK** "Make this list private"
3. Click "Create List"
4. Verify:
   - List is created successfully
   - Lock icon appears on list card
   - List appears in "My Lists" dashboard
   - List does NOT appear on homepage when logged out

### 3. Dashboard Access

1. While logged in, click profile → "My Lists"
2. Verify:
   - URL is `/dashboard`
   - Only your lists are shown
   - Both public and private lists appear
3. Log out and try accessing `/dashboard`
4. Verify:
   - You're redirected to homepage

### 4. List Ownership & Authorization

#### As List Owner
1. Create a new list while logged in
2. Add some links to the list
3. Verify you can:
   - See drag handle for reordering links
   - Edit links (pencil icon)
   - Delete links (trash icon)
   - Delete the list (trash icon in header)
   - Share the list (share button in header)

#### As Non-Owner (Public List)
1. Log out or use different account
2. Navigate to a public list owned by someone else
3. Verify:
   - You can view the list
   - You CANNOT see drag handles
   - You CANNOT see edit/delete buttons on links
   - You CANNOT see delete list button
   - You CAN see share button

#### As Non-Owner (Private List)
1. Log out or use different account
2. Try to navigate to a private list URL
3. Verify:
   - You get a 404 error
   - List is not accessible

### 5. Legacy Lists (No Owner)

1. Create a list in database without user_id:
   ```sql
   INSERT INTO lists (slug, title, description, user_id, is_private) 
   VALUES ('legacy-test', 'Legacy List', 'List with no owner', NULL, FALSE);
   ```
2. Navigate to the list while NOT logged in
3. Verify:
   - You can add/edit/delete links (legacy behavior preserved)

### 6. Session Management

1. Log in
2. Close browser and reopen
3. Navigate to app
4. Verify:
   - You're still logged in (session persists)

5. Wait 30+ days or manually delete session from database:
   ```sql
   DELETE FROM sessions WHERE user_id = YOUR_USER_ID;
   ```
6. Refresh page
7. Verify:
   - You're logged out
   - Session expired correctly

### 7. Privacy Enforcement

#### List Visibility
1. As User A, create a private list
2. Note the list ID and slug
3. Log in as User B
4. Try to access via:
   - Direct URL: `http://localhost:4321/SLUG`
   - API: `http://localhost:4321/api/lists?slug=SLUG`
5. Verify:
   - Both return 404/error
   - List is not accessible

#### API Authorization
1. As User A, create a list (note the ID)
2. Log in as User B
3. Try to update User A's list via API:
   ```bash
   curl -X PATCH http://localhost:4321/api/lists \
     -H "Content-Type: application/json" \
     -d '{"id": USER_A_LIST_ID, "title": "Hacked"}'
   ```
4. Verify:
   - Request returns 403 Unauthorized
   - List is not modified

### 8. Multi-User Scenario

1. Create two user accounts (GitHub and Google)
2. With User 1:
   - Create 2 public lists
   - Create 1 private list
3. With User 2:
   - Create 2 public lists
   - Create 1 private list
4. Verify homepage shows:
   - All 4 public lists when logged out
   - User 1's public lists + User 1's private list when logged in as User 1
   - User 2's public lists + User 2's private list when logged in as User 2
5. Verify dashboards:
   - User 1 dashboard shows only User 1's lists (3 total)
   - User 2 dashboard shows only User 2's lists (3 total)

## Expected Results Summary

✅ **Authentication**
- Users can sign in with GitHub
- Users can sign in with Google
- Sessions persist across browser restarts
- Sessions expire after 30 days
- Users can log out

✅ **List Privacy**
- Users can create public lists (visible to all)
- Users can create private lists (visible only to owner)
- Privacy toggle works correctly
- Private lists show lock icon
- Private lists are hidden from non-owners

✅ **Authorization**
- Only list owners can edit/delete their lists
- Only list owners can add/edit/delete links in their lists
- Non-owners can view public lists (read-only)
- Non-owners cannot access private lists
- Legacy lists (no owner) remain editable by everyone

✅ **Dashboard**
- Dashboard shows only user's lists
- Dashboard requires authentication
- Dashboard shows both public and private user lists

✅ **UI Updates**
- User navigation shows login buttons when logged out
- User navigation shows profile and menu when logged in
- Edit controls only appear for list owners
- Privacy indicator shows on private lists

## Troubleshooting

If any test fails:

1. **Check browser console** for JavaScript errors
2. **Check server logs** for API errors
3. **Check database** to verify data integrity
4. **Verify OAuth credentials** are correctly configured
5. **Clear browser cookies** and try again
6. **Check database migration** was applied correctly

## Performance Considerations

- Session validation adds minimal overhead (single DB query with JOIN)
- Privacy checks use indexed columns (user_id, is_private)
- Authorization checks are performed at both API and UI levels
- Legacy lists without owners continue to work as before

# User Authentication Setup Guide
password = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
This guide explains how to set up user authentication with GitHub and Google OAuth.

## Database Migration

First, apply the database migration to add authentication tables:

```bash
psql -U postgres -d linklists -f migration.sql
```

## Environment Variables

You need to set up OAuth credentials and configure environment variables. Create a `.env` file in the project root:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Public URL (for OAuth callbacks)
PUBLIC_URL=http://localhost:4321
# In production, set to your actual domain:
# PUBLIC_URL=https://yourapp.com
```

## Setting Up GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: The Urlist (or your app name)
   - **Homepage URL**: `http://localhost:4321` (or your production URL)
   - **Authorization callback URL**: `http://localhost:4321/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Add them to your `.env` file

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Configure the OAuth consent screen if you haven't already
6. Select "Web application" as the application type
7. Add authorized redirect URI: `http://localhost:4321/api/auth/google/callback`
8. Copy the **Client ID** and **Client Secret**
9. Add them to your `.env` file

## Testing Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:4321`

3. Click "Sign in with GitHub" or "Sign in with Google"

4. Complete the OAuth flow

5. You should be redirected back to the app and see your profile in the header

## Features

Once authenticated, users can:

- ✅ Create private or public lists
- ✅ View only their lists in the dashboard (`/dashboard`)
- ✅ Edit and delete only their own lists
- ✅ Add, edit, and delete links only in their own lists
- ✅ View public lists from all users
- ✅ Private lists are hidden from other users

## Security Notes

- Session cookies are HTTP-only and use SameSite protection
- Sessions expire after 30 days
- Private lists are enforced at both API and UI levels
- Only list owners can modify their lists and links
- Legacy lists (created before authentication) remain editable by everyone

## Troubleshooting

**OAuth redirect fails:**
- Make sure `PUBLIC_URL` in `.env` matches the URL you're accessing
- Verify OAuth callback URLs are correctly configured in GitHub/Google

**Session not persisting:**
- Check that cookies are enabled in your browser
- Verify `NODE_ENV` is set correctly for secure cookies in production

**Permission denied errors:**
- Check that the database user has permissions to create tables and indexes
- Verify the migration was applied successfully

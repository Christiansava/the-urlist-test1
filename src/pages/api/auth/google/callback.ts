import type { APIRoute } from "astro";
import { google, findOrCreateUser, createSession, setSessionCookie } from "../../../../utils/auth";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("google_oauth_state")?.value;
  const codeVerifier = cookies.get("google_code_verifier")?.value;

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return new Response("Invalid OAuth callback", { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    
    // Fetch user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return new Response("Failed to fetch user info", { status: 500 });
    }

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return new Response("No email found in Google account", { status: 400 });
    }

    // Find or create user
    const user = await findOrCreateUser(
      "google",
      googleUser.id,
      googleUser.email,
      googleUser.name,
      googleUser.picture
    );

    // Create session
    const session = await createSession(user.id);

    // Set session cookie
    const headers = new Headers();
    setSessionCookie(headers, session.id, session.expires_at);

    // Redirect to home
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": headers.get("Set-Cookie") || "",
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
};

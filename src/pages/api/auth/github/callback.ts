import type { APIRoute } from "astro";
import { github, findOrCreateUser, createSession, setSessionCookie } from "../../../../utils/auth";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("github_oauth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response("Invalid OAuth callback", { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    
    // Fetch user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return new Response("Failed to fetch user info", { status: 500 });
    }

    const githubUser = await userResponse.json();

    // Fetch user emails (to get verified email)
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let email = githubUser.email;
    
    // Always try to get email from the emails endpoint (handles private emails)
    if (emailsResponse.ok) {
      const emails = await emailsResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary && e.verified);
      const verifiedEmail = emails.find((e: any) => e.verified);
      email = primaryEmail?.email || verifiedEmail?.email || emails[0]?.email || email;
    }

    // Fallback: use GitHub's noreply email
    if (!email) {
      email = `${githubUser.id}+${githubUser.login}@users.noreply.github.com`;
    }

    // Find or create user
    const user = await findOrCreateUser(
      "github",
      githubUser.id.toString(),
      email,
      githubUser.name || githubUser.login,
      githubUser.avatar_url
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
    console.error("GitHub OAuth error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
};

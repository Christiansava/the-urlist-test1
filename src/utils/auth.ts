import "dotenv/config";
import { GitHub, Google } from "arctic";
import { nanoid } from "nanoid";
import { client } from "./db";
import type { User, Session } from "../types/link";

// OAuth providers configuration
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID || "",
  process.env.GITHUB_CLIENT_SECRET || "",
  `${process.env.PUBLIC_URL || "http://localhost:4321"}/api/auth/github/callback`
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  `${process.env.PUBLIC_URL || "http://localhost:4321"}/api/auth/google/callback`
);

// Session management
const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export async function createSession(userId: number): Promise<Session> {
  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const result = await client.query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *",
    [sessionId, userId, expiresAt]
  );

  return result.rows[0];
}

export async function validateSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
  const result = await client.query(
    `SELECT s.*, u.* FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const session: Session = {
    id: row.id,
    user_id: row.user_id,
    expires_at: row.expires_at,
    created_at: row.created_at,
  };

  const user: User = {
    id: row.user_id,
    email: row.email,
    name: row.name,
    avatar_url: row.avatar_url,
    provider: row.provider,
    provider_user_id: row.provider_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await client.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await client.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

export function setSessionCookie(headers: Headers, sessionId: string, expiresAt: Date): void {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${sessionId}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${expiresAt.toUTCString()}`,
  ];
  
  if (isProduction) {
    cookieParts.push("Secure");
  }
  
  headers.set("Set-Cookie", cookieParts.join("; "));
}

export function deleteSessionCookie(headers: Headers): void {
  headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

export function getSessionIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  
  if (!sessionCookie) return null;
  
  return sessionCookie.split("=")[1];
}

// Find or create user from OAuth data
export async function findOrCreateUser(
  provider: string,
  providerUserId: string,
  email: string,
  name: string | null,
  avatarUrl: string | null
): Promise<User> {
  // Try to find existing user
  const existing = await client.query(
    "SELECT * FROM users WHERE provider = $1 AND provider_user_id = $2",
    [provider, providerUserId]
  );

  if (existing.rows.length > 0) {
    // Update user info in case it changed
    const result = await client.query(
      `UPDATE users SET email = $1, name = $2, avatar_url = $3, updated_at = NOW() 
       WHERE provider = $4 AND provider_user_id = $5 RETURNING *`,
      [email, name, avatarUrl, provider, providerUserId]
    );
    return result.rows[0];
  }

  // Create new user
  const result = await client.query(
    `INSERT INTO users (email, name, avatar_url, provider, provider_user_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [email, name, avatarUrl, provider, providerUserId]
  );

  return result.rows[0];
}

// Clean up expired sessions (should be run periodically)
export async function cleanupExpiredSessions(): Promise<void> {
  await client.query("DELETE FROM sessions WHERE expires_at < NOW()");
}

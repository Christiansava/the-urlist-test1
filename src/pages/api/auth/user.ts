import type { APIRoute } from "astro";
import { validateSession, getSessionIdFromCookie } from "../../../utils/auth";

export const GET: APIRoute = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = getSessionIdFromCookie(cookieHeader);

  if (!sessionId) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await validateSession(sessionId);

  if (!result) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ user: result.user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

import type { APIRoute } from "astro";
import { invalidateSession, deleteSessionCookie, getSessionIdFromCookie } from "../../../utils/auth";

export const POST: APIRoute = async ({ request, redirect }) => {
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = getSessionIdFromCookie(cookieHeader);

  if (sessionId) {
    await invalidateSession(sessionId);
  }

  const headers = new Headers();
  deleteSessionCookie(headers);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": headers.get("Set-Cookie") || "",
    },
  });
};

import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { github } from "../../../utils/auth";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  cookies.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return redirect(url.toString());
};

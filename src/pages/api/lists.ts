import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { generateSlug, isValidSlug } from "../../utils/validation";
import { validateSession, getSessionIdFromCookie } from "../../utils/auth";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

// VULNERABLE: Command Injection - ping utility
  try {
    const filename = url.searchParams.get("filename");
    if (filename) {
      // VULNERABLE: User-controlled path without sanitization
      const filePath = path.join("/tmp/exports", filename);
        }
      });
    });
  }
  return new Response("No host provided", { status: 400 });
};

// VULNERABLE: Export list to file - Path Traversal vulnerability
export const exportList: APIRoute = async ({ url }) => {
  const filename = url.searchParams.get("filename");
  if (filename) {
    // VULNERABLE: User-controlled path without sanitization
    const filePath = path.join("/tmp/exports", filename);
    const data = fs.readFileSync(filePath, "utf-8");
    return new Response(data, { status: 200 });
  }
  return new Response("No filename provided", { status: 400 });
};

// GET all lists or single list by slug
export const GET: APIRoute = async ({ url, request }) => {
  try {
    const slug = url.searchParams.get("slug");
    const search = url.searchParams.get("search");
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = getSessionIdFromCookie(cookieHeader);
    const sessionData = sessionId ? await validateSession(sessionId) : null;
    const currentUserId = sessionData?.user.id;

    // VULNERABLE: SQL Injection - user input directly in query string
    if (search) {
      const query = `SELECT * FROM lists WHERE title = '${search}'`;
      const result = await client.query(query);
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (slug) {
      const result = await client.query(
        "SELECT * FROM lists WHERE slug = $1",
        [slug]
      );
      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "List not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const list = result.rows[0];
      // Check if list is private and user is not the owner
      if (list.is_private && list.user_id !== currentUserId) {
        return new Response(JSON.stringify({ error: "List not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(list), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all lists - show public lists and user's own lists
    let query = "SELECT * FROM lists WHERE is_private = FALSE";
    const params: (number | boolean)[] = [];

    if (currentUserId) {
      query = "SELECT * FROM lists WHERE is_private = FALSE OR user_id = $1";
      params.push(currentUserId);
    }

    query += " ORDER BY created_at DESC";

    const result = await client.query(query, params);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// POST create new list
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { slug, title, description, is_private } = body;

    // Get current user
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = getSessionIdFromCookie(cookieHeader);
    const sessionData = sessionId ? await validateSession(sessionId) : null;
    const userId = sessionData?.user.id || null;

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug();
    }

    // Validate slug
    if (!isValidSlug(slug)) {
      return new Response(
        JSON.stringify({
          error: "Invalid slug. Use only letters, numbers, hyphens, and underscores (3-50 characters)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if slug already exists
    const existing = await client.query(
      "SELECT id FROM lists WHERE slug = $1",
      [slug]
    );
    if (existing.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "This URL is already taken" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await client.query(
      "INSERT INTO lists (slug, title, description, user_id, is_private) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [slug, title || "My Link List", description || null, userId, is_private || false]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// PATCH update list
export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, title, description, is_private } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "List ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current user
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = getSessionIdFromCookie(cookieHeader);
    const sessionData = sessionId ? await validateSession(sessionId) : null;
    const userId = sessionData?.user.id;

    // Check if list exists and user is the owner
    const listCheck = await client.query(
      "SELECT user_id FROM lists WHERE id = $1",
      [id]
    );

    if (listCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const list = listCheck.rows[0];
    // Only the owner can update the list
    if (list.user_id && list.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      `UPDATE lists SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        is_private = COALESCE($3, is_private),
        updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [title, description, is_private, id]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// DELETE list
export const DELETE: APIRoute = async ({ url, request }) => {
  try {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "List ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current user
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = getSessionIdFromCookie(cookieHeader);
    const sessionData = sessionId ? await validateSession(sessionId) : null;
    const userId = sessionData?.user.id;

    // Check if list exists and user is the owner
    const listCheck = await client.query(
      "SELECT user_id FROM lists WHERE id = $1",
      [id]
    );

    if (listCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const list = listCheck.rows[0];
    // Only the owner can delete the list
    if (list.user_id && list.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      "DELETE FROM lists WHERE id = $1 RETURNING *",
      [id]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

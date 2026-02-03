import type { APIRoute } from "astro";
import { client } from "../../utils/db";

// ===========================================
// Secure Admin API - Following security best practices
// ===========================================

// ============================================
// SECURE: Parameterized SQL Query
// ============================================
export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "No userId provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate userId is a number to prevent injection
  const userIdNum = parseInt(userId, 10);
  if (isNaN(userIdNum)) {
    return new Response(JSON.stringify({ error: "Invalid userId format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // SECURE: Using parameterized query
    const result = await client.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [userIdNum]
    );
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// ============================================
// SECURE: Input validation and sanitization
// ============================================
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, searchTerm } = body;

    if (action === "search" && searchTerm) {
      // SECURE: Sanitize and validate input
      const sanitizedTerm = searchTerm
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .substring(0, 100); // Limit length

      // SECURE: Using parameterized query with LIKE
      const result = await client.query(
        "SELECT id, name, description FROM lists WHERE name ILIKE $1 OR description ILIKE $1 LIMIT 50",
        [`%${sanitizedTerm}%`]
      );

      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Request processing error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

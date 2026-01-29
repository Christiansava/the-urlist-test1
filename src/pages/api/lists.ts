import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { generateSlug, isValidSlug } from "../../utils/validation";

// GET all lists or single list by slug
export const GET: APIRoute = async ({ url }) => {
  try {
    const slug = url.searchParams.get("slug");

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
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      "SELECT * FROM lists ORDER BY created_at DESC"
    );
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
    let { slug, title, description } = body;

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
      "INSERT INTO lists (slug, title, description) VALUES ($1, $2, $3) RETURNING *",
      [slug, title || "My Link List", description || null]
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
    const { id, title, description } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "List ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      "UPDATE lists SET title = COALESCE($1, title), description = COALESCE($2, description), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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
export const DELETE: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "List ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      "DELETE FROM lists WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

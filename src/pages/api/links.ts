import type { APIRoute } from "astro";
import { client } from "../../utils/db";
import { sanitizeUrl } from "../../utils/validation";

// GET links for a list
export const GET: APIRoute = async ({ url }) => {
  try {
    const listId = url.searchParams.get("list_id");

    if (!listId) {
      return new Response(
        JSON.stringify({ error: "list_id is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await client.query(
      "SELECT * FROM links WHERE list_id = $1 ORDER BY position ASC, created_at ASC",
      [listId]
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

// POST create new link
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { list_id, url: rawUrl, title, description, image } = body;

    if (!list_id || !rawUrl) {
      return new Response(
        JSON.stringify({ error: "list_id and url are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize URL
    let sanitizedUrl: string;
    try {
      sanitizedUrl = sanitizeUrl(rawUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the max position for this list
    const posResult = await client.query(
      "SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM links WHERE list_id = $1",
      [list_id]
    );
    const nextPosition = posResult.rows[0].next_pos;

    // Fetch metadata if not provided
    let linkTitle = title;
    let linkDescription = description;
    let linkImage = image;

    if (!title || !description || !image) {
      try {
        const metaResponse = await fetch(
          `${request.headers.get("origin")}/api/metadata?url=${encodeURIComponent(sanitizedUrl)}`
        );
        if (metaResponse.ok) {
          const metadata = await metaResponse.json();
          linkTitle = title || metadata.title;
          linkDescription = description || metadata.description;
          linkImage = image || metadata.image;
        }
      } catch {
        // Metadata fetch failed, continue without it
      }
    }

    const result = await client.query(
      "INSERT INTO links (list_id, url, title, description, image, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [list_id, sanitizedUrl, linkTitle, linkDescription, linkImage, nextPosition]
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

// PATCH update link
export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, url, title, description, image, position } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Link ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If URL is being updated, sanitize it
    let sanitizedUrl = url;
    if (url) {
      try {
        sanitizedUrl = sanitizeUrl(url);
      } catch {
        return new Response(JSON.stringify({ error: "Invalid URL format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const result = await client.query(
      `UPDATE links SET 
        url = COALESCE($1, url), 
        title = COALESCE($2, title), 
        description = COALESCE($3, description), 
        image = COALESCE($4, image),
        position = COALESCE($5, position),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $6 RETURNING *`,
      [sanitizedUrl, title, description, image, position, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Link not found" }), {
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

// DELETE link
export const DELETE: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Link ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await client.query(
      "DELETE FROM links WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Link not found" }), {
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

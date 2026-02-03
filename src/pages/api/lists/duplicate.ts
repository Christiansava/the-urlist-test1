import type { APIRoute } from "astro";
import { client } from "../../../utils/db";
import { generateSlug } from "../../../utils/validation";
import { validateSession, getSessionIdFromCookie } from "../../../utils/auth";

/**
 * POST /api/lists/duplicate
 * Duplicates an existing list and all its links
 * 
 * Body: { listId: number, includeLinks?: boolean, newTitle?: string }
 * - listId: The ID of the list to duplicate
 * - includeLinks: Whether to copy the links (default: true)
 * - newTitle: Optional custom title for the new list
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { listId, includeLinks = true, newTitle } = body;

    if (!listId) {
      return new Response(
        JSON.stringify({ error: "listId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get current user
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = getSessionIdFromCookie(cookieHeader);
    const sessionData = sessionId ? await validateSession(sessionId) : null;
    const userId = sessionData?.user.id || null;

    // Fetch the source list
    const sourceListResult = await client.query(
      "SELECT * FROM lists WHERE id = $1",
      [listId]
    );

    if (sourceListResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "List not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sourceList = sourceListResult.rows[0];

    // Check if user can access this list (public or owner)
    if (sourceList.is_private && sourceList.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Cannot duplicate a private list you don't own" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate a new unique slug
    let newSlug = generateSlug();
    let slugExists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (slugExists && attempts < maxAttempts) {
      const existingSlug = await client.query(
        "SELECT id FROM lists WHERE slug = $1",
        [newSlug]
      );
      if (existingSlug.rows.length === 0) {
        slugExists = false;
      } else {
        newSlug = generateSlug();
        attempts++;
      }
    }

    if (slugExists) {
      return new Response(
        JSON.stringify({ error: "Could not generate a unique slug. Please try again." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the title for the new list
    const duplicatedTitle = newTitle || `Copy of ${sourceList.title || "Untitled List"}`;

    // Create the new list
    const newListResult = await client.query(
      `INSERT INTO lists (slug, title, description, user_id, is_private)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        newSlug,
        duplicatedTitle,
        sourceList.description,
        userId, // New list belongs to current user
        false, // Duplicated lists start as public
      ]
    );

    const newList = newListResult.rows[0];

    // Copy links if requested
    let copiedLinksCount = 0;
    if (includeLinks) {
      const sourceLinksResult = await client.query(
        "SELECT url, title, description, image, position FROM links WHERE list_id = $1 ORDER BY position",
        [listId]
      );

      for (const link of sourceLinksResult.rows) {
        await client.query(
          `INSERT INTO links (list_id, url, title, description, image, position)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            newList.id,
            link.url,
            link.title,
            link.description,
            link.image,
            link.position,
          ]
        );
        copiedLinksCount++;
      }
    }

    // Fetch the complete new list with links count
    const finalListResult = await client.query(
      `SELECT l.*, 
        (SELECT COUNT(*) FROM links WHERE list_id = l.id) as links_count
       FROM lists l WHERE l.id = $1`,
      [newList.id]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `List duplicated successfully with ${copiedLinksCount} links`,
        list: finalListResult.rows[0],
        sourceListId: listId,
        copiedLinks: copiedLinksCount,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error duplicating list:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

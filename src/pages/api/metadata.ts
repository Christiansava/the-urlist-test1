import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  try {
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the page HTML
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TheUrlist/1.0)",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          title: null,
          description: null,
          image: null,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const html = await response.text();

    // Extract metadata using regex (simple approach without metascraper for reliability)
    const getMetaContent = (name: string): string | null => {
      const ogMatch = html.match(
        new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([^"']*)["']`, "i")
      );
      if (ogMatch) return ogMatch[1];

      const ogMatch2 = html.match(
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${name}["']`, "i")
      );
      if (ogMatch2) return ogMatch2[1];

      const nameMatch = html.match(
        new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i")
      );
      if (nameMatch) return nameMatch[1];

      const nameMatch2 = html.match(
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i")
      );
      if (nameMatch2) return nameMatch2[1];

      return null;
    };

    const getTitle = (): string | null => {
      const ogTitle = getMetaContent("title");
      if (ogTitle) return ogTitle;

      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch) return titleMatch[1].trim();

      return null;
    };

    const title = getTitle();
    const description = getMetaContent("description");
    const image = getMetaContent("image");

    return new Response(
      JSON.stringify({
        title,
        description,
        image,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        title: null,
        description: null,
        image: null,
        error: (error as Error).message,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

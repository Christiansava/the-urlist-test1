export function sanitizeUrl(url: string): string {
  let sanitized = url.trim();
  
  // Add protocol if missing
  if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
    sanitized = "https://" + sanitized;
  }
  
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    throw new Error("Invalid URL format");
  }
}

export function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length >= 3 && slug.length <= 50;
}

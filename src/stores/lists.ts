import { atom } from "nanostores";
import type { Link, List } from "../types/link";

export const currentLinks = atom<Link[]>([]);
export const currentList = atom<List | null>(null);
export const allLists = atom<List[]>([]);

export async function fetchLinks(listId: number) {
  const response = await fetch(`/api/links?list_id=${listId}`);
  if (response.ok) {
    const links = await response.json();
    currentLinks.set(links);
  }
}

export async function fetchAllLists() {
  const response = await fetch("/api/lists");
  if (response.ok) {
    const lists = await response.json();
    allLists.set(lists);
  }
}

export async function addLink(listId: number, url: string) {
  const response = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ list_id: listId, url }),
  });
  if (response.ok) {
    await fetchLinks(listId);
  }
  return response;
}

export async function updateLink(
  linkId: number,
  listId: number,
  data: Partial<Link>
) {
  const response = await fetch(`/api/links`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: linkId, ...data }),
  });
  if (response.ok) {
    await fetchLinks(listId);
  }
  return response;
}

export async function deleteLink(linkId: number, listId: number) {
  const response = await fetch(`/api/links?id=${linkId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await fetchLinks(listId);
  }
  return response;
}

export async function deleteList(listId: number) {
  const response = await fetch(`/api/lists?id=${listId}`, {
    method: "DELETE",
  });
  return response;
}

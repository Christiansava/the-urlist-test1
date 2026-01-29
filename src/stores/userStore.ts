import { atom } from "nanostores";
import type { User } from "../types/link";

export const userStore = atom<User | null>(null);

// Fetch current user and update store
export async function loadUser() {
  try {
    const response = await fetch("/api/auth/user");
    if (response.ok) {
      const data = await response.json();
      userStore.set(data.user);
    } else {
      userStore.set(null);
    }
  } catch (error) {
    console.error("Failed to load user:", error);
    userStore.set(null);
  }
}

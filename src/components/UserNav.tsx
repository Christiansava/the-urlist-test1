import { useStore } from "@nanostores/react";
import { userStore, loadUser } from "../stores/userStore";
import { useEffect, useState } from "react";

export default function UserNav() {
  const user = useStore(userStore);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/api/auth/github"
          className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Sign in with GitHub
        </a>
        <a
          href="/api/auth/google"
          className="px-4 py-2 bg-[#15BFAE] text-white font-medium rounded-lg hover:bg-[#13a89a] transition-colors"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.name || user.email}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-gray-700 font-medium">
          {user.name || user.email}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              My Lists
            </a>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

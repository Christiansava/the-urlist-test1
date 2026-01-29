import { useState } from "react";

interface CreateListProps {
  onCreated?: (slug: string) => void;
}

export default function CreateList({ onCreated }: CreateListProps) {
  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "My Link List",
          slug: customSlug || undefined,
          description: description || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create list");
        setLoading(false);
        return;
      }

      if (onCreated) {
        onCreated(data.slug);
      } else {
        window.location.href = `/${data.slug}`;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          List Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Links"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Custom URL (optional)
        </label>
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">urlist.com/</span>
          <input
            type="text"
            id="slug"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
            placeholder="my-links"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 outline-none transition-all"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for an auto-generated URL
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A collection of useful resources..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 outline-none transition-all resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-[#15BFAE] text-white font-medium rounded-xl hover:bg-[#13a89a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create List"}
      </button>
    </form>
  );
}

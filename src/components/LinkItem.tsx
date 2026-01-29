import { useState } from "react";
import type { Link } from "../types/link";

interface LinkItemProps {
  link: Link;
  onUpdate: (id: number, data: Partial<Link>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function LinkItem({ link, onUpdate, onDelete }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(link.url);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editUrl.trim()) return;
    setLoading(true);
    await onUpdate(link.id, { url: editUrl.trim() });
    setIsEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this link?")) {
      setLoading(true);
      await onDelete(link.id);
    }
  };

  const handleCancel = () => {
    setEditUrl(link.url);
    setIsEditing(false);
  };

  const domain = (() => {
    try {
      return new URL(link.url).hostname.replace("www.", "");
    } catch {
      return link.url;
    }
  })();

  if (isEditing) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl">
        <input
          type="text"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 outline-none mb-3"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#15BFAE] text-white text-sm font-medium rounded-lg hover:bg-[#13a89a] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {link.image && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={link.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="font-medium text-gray-900 truncate hover:text-[#15BFAE] transition-colors">
              {link.title || domain}
            </h3>
            {link.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {link.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">{domain}</p>
          </a>
        </div>
        <div className="flex-shrink-0 flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-[#15BFAE] transition-colors"
            title="Edit link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

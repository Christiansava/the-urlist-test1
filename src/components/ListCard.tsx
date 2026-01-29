import { useEffect, useState } from "react";
import type { List } from "../types/link";

interface ListCardProps {
  list: List;
}

export default function ListCard({ list }: ListCardProps) {
  const [linkCount, setLinkCount] = useState(0);

  useEffect(() => {
    fetch(`/api/links?list_id=${list.id}`)
      .then((res) => res.json())
      .then((links) => setLinkCount(links.length))
      .catch(() => setLinkCount(0));
  }, [list.id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <a
      href={`/${list.slug}`}
      className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-[#15BFAE]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{list.title}</h3>
        {list.is_private && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Private
          </span>
        )}
      </div>
      {list.description && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {list.description}
        </p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{linkCount} links</span>
        <span>{formatDate(list.created_at)}</span>
      </div>
    </a>
  );
}

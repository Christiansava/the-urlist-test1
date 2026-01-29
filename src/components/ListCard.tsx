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
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{list.title}</h3>
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

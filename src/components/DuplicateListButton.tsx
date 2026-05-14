import { useState } from "react";

interface DuplicateListButtonProps {
  listId: number;
  listTitle?: string;
  onDuplicated?: (newSlug: string) => void;
}

export default function DuplicateListButton({ 
  listId, 
  listTitle,
  onDuplicated 
}: DuplicateListButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [customTitle, setCustomTitle] = useState("");

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/lists/duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId,
          includeLinks,
          newTitle: customTitle || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onDuplicated) {
          onDuplicated(data.list.slug);
        } else {
          // Navigate to the new duplicated list
          window.location.href = `/${data.list.slug}`;
        }
      } else {
        alert(data.error || "Failed to duplicate list");
      }
    } catch {
      alert("Something went wrong while duplicating the list");
    } finally {
      setLoading(false);
      setShowOptions(false);
    }
  };

  const handleQuickDuplicate = () => {
    setIncludeLinks(true);
    setCustomTitle("");
    handleDuplicate();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        {/* Main duplicate button */}
        <button
          onClick={handleQuickDuplicate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-[#15BFAE] hover:bg-[#15BFAE]/10 rounded-l-lg transition-colors disabled:opacity-50 border border-[#15BFAE]/30"
          title="Duplicate this list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
          </svg>
          {loading ? "Duplicating..." : "Duplicate"}
        </button>

        {/* Options dropdown toggle */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={loading}
          className="px-2 py-2 text-[#15BFAE] hover:bg-[#15BFAE]/10 rounded-r-lg transition-colors disabled:opacity-50 border border-l-0 border-[#15BFAE]/30"
          title="Duplicate options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${showOptions ? "rotate-180" : ""}`}
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
      </div>

      {/* Options dropdown */}
      {showOptions && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Duplicate Options</h3>
            
            {/* Custom title input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New list title (optional)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={`Copy of ${listTitle || "this list"}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#15BFAE]/20 focus:border-[#15BFAE] text-sm"
              />
            </div>

            {/* Include links checkbox */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLinks}
                  onChange={(e) => setIncludeLinks(e.target.checked)}
                  className="w-4 h-4 text-[#15BFAE] border-gray-300 rounded focus:ring-[#15BFAE]"
                />
                <span className="text-sm text-gray-700">Include all links</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Uncheck to create an empty copy of the list structure
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDuplicate}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#15BFAE] text-white font-medium rounded-lg hover:bg-[#13a89a] transition-colors disabled:opacity-50"
              >
                {loading ? "Duplicating..." : "Duplicate List"}
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

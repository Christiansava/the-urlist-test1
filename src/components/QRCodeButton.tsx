import { useState } from 'react';
import { QRCodeModal } from './QRCodeModal';

interface QRCodeButtonProps {
  url: string;
  listName?: string;
}

export function QRCodeButton({ url, listName }: QRCodeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#15BFAE] hover:bg-[#15BFAE]/10 rounded-lg transition-colors"
        title="Generate QR Code"
        aria-label="Generate QR Code for this list"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
          />
        </svg>
        <span className="text-sm font-medium">QR Code</span>
      </button>

      <QRCodeModal
        url={url}
        listName={listName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

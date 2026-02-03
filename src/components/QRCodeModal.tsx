import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  url: string;
  listName?: string;
  isOpen: boolean;
  onClose: () => void;
}

type QRColor = {
  name: string;
  dark: string;
  light: string;
};

const colorPresets: QRColor[] = [
  { name: 'Default', dark: '#000000', light: '#FFFFFF' },
  { name: 'Teal', dark: '#15BFAE', light: '#FFFFFF' },
  { name: 'Blue', dark: '#3B82F6', light: '#FFFFFF' },
  { name: 'Purple', dark: '#8B5CF6', light: '#FFFFFF' },
  { name: 'Dark', dark: '#1F2937', light: '#F9FAFB' },
];

export function QRCodeModal({ url, listName = 'List', isOpen, onClose }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<QRColor>(colorPresets[1]); // Default to Teal
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url, selectedColor]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: selectedColor.dark,
          light: selectedColor.light,
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = async (format: 'png' | 'svg') => {
    try {
      if (format === 'png') {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `${listName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qrcode.png`;
        link.href = qrDataUrl;
        link.click();
      } else {
        // Generate and download as SVG
        const svgString = await QRCode.toString(url, {
          type: 'svg',
          width: 300,
          margin: 2,
          color: {
            dark: selectedColor.dark,
            light: selectedColor.light,
          },
          errorCorrectionLevel: 'H',
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${listName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qrcode.svg`;
        link.href = svgUrl;
        link.click();
        URL.revokeObjectURL(svgUrl);
      }
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center px-6 py-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            {isGenerating ? (
              <div className="w-[268px] h-[268px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#15BFAE] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code for ${listName}`}
                className="w-[268px] h-[268px]"
              />
            ) : (
              <div className="w-[268px] h-[268px] flex items-center justify-center text-gray-400">
                Failed to generate QR code
              </div>
            )}
          </div>
          
          <p className="mt-3 text-sm text-gray-500 text-center max-w-[268px] truncate">
            {url}
          </p>
        </div>

        {/* Color Presets */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex gap-2">
            {colorPresets.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  selectedColor.name === color.name
                    ? 'border-[#15BFAE] ring-2 ring-[#15BFAE]/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.dark }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="px-6 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Download</label>
          <div className="flex gap-3">
            <button
              onClick={() => downloadQRCode('png')}
              disabled={!qrDataUrl || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#15BFAE] text-white font-medium rounded-xl hover:bg-[#13a89a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PNG
            </button>
            <button
              onClick={() => downloadQRCode('svg')}
              disabled={!qrDataUrl || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              SVG
            </button>
          </div>
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

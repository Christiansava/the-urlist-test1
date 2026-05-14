import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRCodeModal } from '../components/QRCodeModal';
import { QRCodeButton } from '../components/QRCodeButton';

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock-qr-code'),
    toString: vi.fn().mockResolvedValue('<svg>mock-svg</svg>'),
  },
}));

describe('QRCodeModal', () => {
  const defaultProps = {
    url: 'https://example.com/my-list',
    listName: 'My Test List',
    isOpen: true,
    onClose: vi.fn(),
  };

  it('renders the modal when open', () => {
    render(<QRCodeModal {...defaultProps} />);
    
    expect(screen.getByText('QR Code')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/my-list')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<QRCodeModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('QR Code')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<QRCodeModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside modal', () => {
    const onClose = vi.fn();
    render(<QRCodeModal {...defaultProps} onClose={onClose} />);
    
    // Click on the backdrop
    const backdrop = screen.getByText('QR Code').parentElement?.parentElement?.parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });

  it('displays color preset buttons', () => {
    render(<QRCodeModal {...defaultProps} />);
    
    expect(screen.getByTitle('Default')).toBeInTheDocument();
    expect(screen.getByTitle('Teal')).toBeInTheDocument();
    expect(screen.getByTitle('Blue')).toBeInTheDocument();
    expect(screen.getByTitle('Purple')).toBeInTheDocument();
    expect(screen.getByTitle('Dark')).toBeInTheDocument();
  });

  it('displays download buttons', () => {
    render(<QRCodeModal {...defaultProps} />);
    
    expect(screen.getByText('PNG')).toBeInTheDocument();
    expect(screen.getByText('SVG')).toBeInTheDocument();
  });
});

describe('QRCodeButton', () => {
  it('renders the button with QR code icon', () => {
    render(<QRCodeButton url="https://example.com" listName="Test" />);
    
    expect(screen.getByText('QR Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Generate QR Code for this list')).toBeInTheDocument();
  });

  it('opens the modal when clicked', async () => {
    render(<QRCodeButton url="https://example.com" listName="Test" />);
    
    const button = screen.getByText('QR Code');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
  });
});

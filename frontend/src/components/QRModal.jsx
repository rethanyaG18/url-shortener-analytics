import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function QRModal({ url, onClose }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-canvas canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'snaplink-qr.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleCopy = async () => {
    await copyToClipboard(url);
    toast.success('Link copied!');
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="glass p-8 max-w-sm w-full text-center fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">QR Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        <div
          id="qr-canvas"
          className="flex items-center justify-center p-4 bg-white rounded-2xl mb-4 mx-auto"
          style={{ width: 'fit-content' }}
        >
          <QRCodeCanvas value={url} size={200} level="H" includeMargin={false} />
        </div>

        <p className="text-indigo-400 text-sm font-medium mb-6 break-all">{url}</p>

        <div className="flex gap-3">
          <button onClick={handleCopy} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Link
          </button>
          <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

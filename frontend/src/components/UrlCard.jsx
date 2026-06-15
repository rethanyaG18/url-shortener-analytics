import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { urlService } from '../services/urlService';
import { formatDate, truncateUrl, buildShortUrl, copyToClipboard, getErrorMessage } from '../utils/helpers';
import QRModal from './QRModal';

export default function UrlCard({ url, onDeleted }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shortUrl = buildShortUrl(url.short_code);

  const handleCopy = async () => {
    try {
      await copyToClipboard(shortUrl);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this short URL? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await urlService.delete(url.id);
      toast.success('URL deleted');
      onDeleted?.(url.id);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const isExpired = url.expires_at && new Date(url.expires_at) < new Date();

  return (
    <>
      <div className={`glass p-5 fade-in transition-all hover:border-indigo-500/30 ${isExpired ? 'opacity-60' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <svg width="18" height="18" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Short URL row */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 font-semibold text-sm hover:text-indigo-300 transition-colors break-all"
              >
                {shortUrl}
              </a>
              {isExpired && (
                <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                  Expired
                </span>
              )}
              {url.custom_alias && (
                <span className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                  Custom
                </span>
              )}
            </div>

            {/* Original URL */}
            <p className="text-slate-500 text-xs mt-1 break-all" title={url.original_url}>
              {truncateUrl(url.original_url, 65)}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(url.created_at)}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {url.click_count ?? 0} clicks
              </span>
              {url.expires_at && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Expires {formatDate(url.expires_at)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              title="Copy short URL"
              className="btn-secondary px-3 py-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              onClick={() => setShowQR(true)}
              title="Show QR Code"
              className="btn-secondary px-3 py-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
              </svg>
            </button>
            <button
              onClick={() => navigate(`/analytics/${url.id}`)}
              title="View Analytics"
              className="btn-secondary px-3 py-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete URL"
              className="btn-danger px-3 py-2"
            >
              {deleting ? (
                <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
              ) : (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {showQR && <QRModal url={shortUrl} onClose={() => setShowQR(false)} />}
    </>
  );
}

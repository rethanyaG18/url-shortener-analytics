import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { buildShortUrl, formatDateTime, getErrorMessage } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsService.getPublic(shortCode)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Mini navbar */}
      <nav className="border-b border-[#2a2a4a] bg-[#0f0f1a]/90 backdrop-blur-xl px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="font-bold gradient-text">SnapLink</span>
        </Link>
        <span className="ml-3 text-slate-600 text-sm">/ Public Stats</span>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        {loading ? (
          <LoadingSpinner message="Loading stats…" />
        ) : error ? (
          <div className="text-center fade-in">
            <p className="text-red-400 mb-4">{error}</p>
            <Link to="/" className="btn-primary px-6 py-2.5">Go Home</Link>
          </div>
        ) : (
          <div className="w-full max-w-sm fade-in">
            <div className="glass p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <a
                href={buildShortUrl(data.url.short_code)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 font-bold text-lg hover:text-indigo-300 break-all"
              >
                {buildShortUrl(data.url.short_code)}
              </a>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="stat-card text-left">
                  <p className="text-xs text-slate-400 mb-1">Total Clicks</p>
                  <p className="text-3xl font-black gradient-text">{data.totalClicks}</p>
                </div>
                <div className="stat-card text-left">
                  <p className="text-xs text-slate-400 mb-1">Last Visited</p>
                  <p className="text-sm font-semibold text-white">
                    {data.lastVisited ? formatDateTime(data.lastVisited) : 'Never'}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-4">
                Created {formatDateTime(data.url.created_at)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

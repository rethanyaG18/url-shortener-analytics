import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { urlService } from '../services/urlService';
import { getErrorMessage } from '../utils/helpers';
import Navbar from '../components/Navbar';
import UrlForm from '../components/UrlForm';
import UrlCard from '../components/UrlCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUrls = useCallback(async () => {
    try {
      const res = await urlService.getAll();
      setUrls(res.data.data.urls);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleCreated = (newUrl) => {
    setUrls((prev) => [{ ...newUrl, click_count: 0 }, ...prev]);
  };

  const handleDeleted = (id) => {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  };

  const filtered = urls.filter((u) =>
    u.original_url.toLowerCase().includes(search.toLowerCase()) ||
    u.short_code.toLowerCase().includes(search.toLowerCase())
  );

  // Stats summary
  const totalClicks = urls.reduce((sum, u) => sum + (u.click_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Manage and track all your shortened links</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 fade-in">
          <div className="stat-card">
            <p className="text-xs text-slate-400 mb-1">Total Links</p>
            <p className="text-2xl font-bold text-white">{urls.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-slate-400 mb-1">Total Clicks</p>
            <p className="text-2xl font-bold gradient-text">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="stat-card col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-400 mb-1">Active Links</p>
            <p className="text-2xl font-bold text-white">
              {urls.filter((u) => !u.expires_at || new Date(u.expires_at) > new Date()).length}
            </p>
          </div>
        </div>

        {/* URL creation form */}
        <div className="mb-6">
          <UrlForm onCreated={handleCreated} />
        </div>

        {/* URL list */}
        <div className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Your Links
              {urls.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20">
                  {urls.length}
                </span>
              )}
            </h2>
            {urls.length > 3 && (
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search links…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-8 py-2 text-sm w-48"
                />
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your links…" />
          ) : filtered.length === 0 ? (
            urls.length === 0 ? (
              <EmptyState
                icon="🔗"
                title="No links yet"
                description="Paste a long URL above to create your first short link and start tracking clicks."
              />
            ) : (
              <EmptyState
                icon="🔍"
                title="No results found"
                description={`No links match "${search}"`}
              />
            )
          ) : (
            <div className="space-y-3">
              {filtered.map((url) => (
                <UrlCard key={url.id} url={url} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

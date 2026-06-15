import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { analyticsService } from '../services/analyticsService';
import { getErrorMessage, buildShortUrl, formatDateTime, timeAgo, truncateUrl, copyToClipboard } from '../utils/helpers';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import DailyClicksChart from '../components/charts/DailyClicksChart';
import PieStatChart from '../components/charts/PieStatChart';

const StatCard = ({ icon, label, value, sub }) => (
  <div className="stat-card flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d'); // '7d' | '30d'

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyticsService.get(id);
        setData(res.data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <Navbar />
        <LoadingSpinner size="lg" message="Loading analytics…" />
      </div>
    );
  }

  if (!data) return null;

  const shortUrl = buildShortUrl(data.url.short_code);
  const chartData = range === '7d' ? data.last7Days : data.dailyClicks;

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors fade-in"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Dashboard
        </button>

        {/* URL Info Header */}
        <div className="glass p-6 mb-6 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 font-bold text-lg hover:text-indigo-300 transition-colors"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={async () => { await copyToClipboard(shortUrl); toast.success('Copied!'); }}
                  className="text-slate-500 hover:text-indigo-400 transition-colors"
                  title="Copy"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-500 text-sm break-all" title={data.url.original_url}>
                → {truncateUrl(data.url.original_url, 80)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-sm text-slate-300">{formatDateTime(data.url.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            label="Total Clicks"
            value={data.totalClicks.toLocaleString()}
          />
          <StatCard
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            }
            label="Last Visited"
            value={data.lastVisited ? timeAgo(data.lastVisited) : 'Never'}
            sub={data.lastVisited ? formatDateTime(data.lastVisited) : ''}
          />
          <StatCard
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
            label="Last 7 Days"
            value={data.last7Days.reduce((s, d) => s + d.clicks, 0).toLocaleString()}
            sub="clicks"
          />
        </div>

        {/* Daily clicks chart */}
        <div className="glass p-6 mb-6 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Click Trends</h2>
            <div className="flex bg-[#1e1e35] rounded-lg p-1 gap-1">
              {['7d', '30d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    range === r
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>
          <DailyClicksChart data={chartData} />
        </div>

        {/* Browser & Device pie charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="glass p-6 fade-in">
            <h2 className="font-semibold text-white mb-4">Browsers</h2>
            <PieStatChart data={data.browserStats} />
          </div>
          <div className="glass p-6 fade-in">
            <h2 className="font-semibold text-white mb-4">Devices</h2>
            <PieStatChart data={data.deviceStats} />
          </div>
        </div>

        {/* OS chart */}
        <div className="glass p-6 mb-6 fade-in">
          <h2 className="font-semibold text-white mb-4">Operating Systems</h2>
          <PieStatChart data={data.osStats} />
        </div>

        {/* Recent visits table */}
        <div className="glass p-6 fade-in">
          <h2 className="font-semibold text-white mb-4">Recent Visits</h2>
          {data.recentVisits.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No visits recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-[#2a2a4a]">
                    <th className="pb-3 pr-4 font-medium">Time</th>
                    <th className="pb-3 pr-4 font-medium">Browser</th>
                    <th className="pb-3 pr-4 font-medium">Device</th>
                    <th className="pb-3 pr-4 font-medium">OS</th>
                    <th className="pb-3 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.map((visit) => (
                    <tr
                      key={visit.id}
                      className="border-b border-[#1e1e35] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">
                        {timeAgo(visit.visited_at)}
                        <span className="block text-xs text-slate-600">{formatDateTime(visit.visited_at)}</span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{visit.browser || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${
                          visit.device === 'Mobile'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : visit.device === 'Tablet'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {visit.device || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{visit.os || '—'}</td>
                      <td className="py-3 text-slate-600 text-xs font-mono">{visit.ip_address || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

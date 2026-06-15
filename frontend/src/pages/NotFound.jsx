import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10 fade-in">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or the short link has expired.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary px-6 py-2.5">
            Go to Dashboard
          </Link>
          <Link to="/" className="btn-secondary px-6 py-2.5">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

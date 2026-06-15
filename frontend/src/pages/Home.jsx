import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Feature = ({ icon, title, desc }) => (
  <div className="glass p-6 hover:border-indigo-500/40 transition-all hover:-translate-y-1 fade-in">
    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-medium mb-6 fade-in">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full pulse-glow" />
          Free URL Shortener with Analytics
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight fade-in">
          Shorten. Share.<br />
          <span className="gradient-text">Track Everything.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8 fade-in">
          Turn long URLs into powerful short links. Get real-time analytics on every click — browser, device, location, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary px-8 py-3.5 text-base">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary px-8 py-3.5 text-base">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3.5 text-base">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Demo URL bar */}
        <div className="mt-12 max-w-xl mx-auto glass p-4 flex items-center gap-3 fade-in">
          <div className="flex-1 bg-[#0f0f1a] rounded-lg px-3 py-2 text-left">
            <p className="text-slate-600 text-xs mb-0.5">Long URL</p>
            <p className="text-slate-400 text-sm truncate">https://example.com/very/long/url/that/needs/shortening</p>
          </div>
          <svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
          </svg>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2 shrink-0">
            <p className="text-slate-600 text-xs mb-0.5">Short URL</p>
            <p className="text-indigo-400 font-bold text-sm">snap.link/abc123</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Everything you need to manage links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="Instant Shortening"
            desc="Generate short links instantly. Custom aliases available for branded links."
          />
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
            title="Click Analytics"
            desc="Track every click with timestamp, browser, device, and OS data."
          />
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" /></svg>}
            title="QR Code Generator"
            desc="Every link comes with a downloadable QR code — perfect for print and sharing."
          />
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
            title="Secure & Private"
            desc="JWT-authenticated dashboard. Your links are only visible to you."
          />
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
            title="Expiry Dates"
            desc="Set expiry dates on links. Expired links automatically stop redirecting."
          />
          <Feature
            icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
            title="Beautiful Charts"
            desc="Visualise click trends with 7-day and 30-day area charts and pie breakdowns."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a4a] text-center py-6 text-slate-600 text-xs">
        <p>© 2026 SnapLink · Built for the Katomaran Hackathon</p>
        <p className="mt-1">
          This project is a part of a hackathon run by{' '}
          <a href="https://katomaran.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
            https://katomaran.com
          </a>
        </p>
      </footer>
    </div>
  );
}

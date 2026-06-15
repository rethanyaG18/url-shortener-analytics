import { useState } from 'react';
import toast from 'react-hot-toast';
import { urlService } from '../services/urlService';
import { getErrorMessage } from '../utils/helpers';

export default function UrlForm({ onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!originalUrl.trim()) {
      errs.originalUrl = 'URL is required';
    } else {
      try {
        const parsed = new URL(originalUrl.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          errs.originalUrl = 'URL must start with http:// or https://';
        }
      } catch {
        errs.originalUrl = 'Please enter a valid URL';
      }
    }
    if (customAlias && !/^[a-zA-Z0-9]{3,20}$/.test(customAlias)) {
      errs.customAlias = 'Alias must be 3-20 alphanumeric characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const payload = { original_url: originalUrl.trim() };
      if (customAlias.trim()) payload.custom_alias = customAlias.trim();
      if (expiresAt) payload.expires_at = expiresAt;

      const res = await urlService.create(payload);
      toast.success('Short URL created!');
      onCreated?.(res.data.data.url);
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      setShowAdvanced(false);
    } catch (err) {
      const msg = getErrorMessage(err);
      // show field-level errors from backend if available
      const fieldErrors = err?.response?.data?.errors;
      if (fieldErrors?.length) {
        const errMap = {};
        fieldErrors.forEach(({ field, message }) => { errMap[field] = message; });
        setErrors(errMap);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 fade-in">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
        Shorten a URL
      </h2>

      {/* Main URL input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            id="original-url"
            type="text"
            placeholder="Paste your long URL here…"
            value={originalUrl}
            onChange={(e) => { setOriginalUrl(e.target.value); setErrors({}); }}
            className={`input-field ${errors.originalUrl ? 'error' : ''}`}
            disabled={loading}
          />
          {errors.originalUrl && (
            <p className="text-red-400 text-xs mt-1.5">{errors.originalUrl}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 whitespace-nowrap px-6"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          )}
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </div>

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-3 text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
      >
        <svg
          width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {showAdvanced ? 'Hide' : 'Show'} advanced options (custom alias, expiry)
      </button>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#2a2a4a]">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Custom Alias <span className="text-slate-600">(optional)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 text-xs text-slate-500 bg-[#1e1e35] border border-r-0 border-[#2a2a4a] rounded-l-lg whitespace-nowrap">
                snaplink.io/
              </span>
              <input
                id="custom-alias"
                type="text"
                placeholder="my-alias"
                value={customAlias}
                onChange={(e) => { setCustomAlias(e.target.value); setErrors({}); }}
                className={`input-field rounded-l-none ${errors.customAlias ? 'error' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.customAlias && (
              <p className="text-red-400 text-xs mt-1">{errors.customAlias}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Expiry Date <span className="text-slate-600">(optional)</span>
            </label>
            <input
              id="expires-at"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="input-field"
              style={{ colorScheme: 'dark' }}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </form>
  );
}

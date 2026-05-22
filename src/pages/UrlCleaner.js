import { useState } from 'react';
import { urlAPI } from '../api';
import CopyButton from '../components/CopyButton';

export default function UrlCleaner() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClean = async () => {
    if (!input.trim()) return setError('Please paste some URLs first.');
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await urlAPI.clean(input);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">URL <span className="highlight">Cleaner</span> & Deduplicator</h1>
        <p className="page-subtitle">// removes duplicates, google.com, facebook.com &amp; invalid URLs</p>
      </div>

      <div className="card" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--accent-green)' }}>✅ Remove duplicate URLs</span>
          <span style={{ color: 'var(--danger)' }}>🚫 Remove google.com &amp; facebook.com</span>
          <span style={{ color: 'var(--accent-cyan)' }}>✨ Keep only valid URLs</span>
          <span style={{ color: '#a78bfa' }}>📤 Export clean list</span>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span className="dot" />Paste URLs</span>
        </div>
        <div className="textarea-wrapper">
          <textarea
            className="tool-textarea"
            rows={9}
            placeholder={"Paste URLs here, one per line:\n\nhttps://example.com\nhttps://google.com/search\nhttps://domain.com\nhttps://example.com  (duplicate)"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div className="btn-actions">
          <button className="btn btn-primary" onClick={handleClean} disabled={loading || !input.trim()}>
            {loading ? '⏳ Cleaning...' : '✨ Clean URLs'}
          </button>
          <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>✕ Clear</button>
        </div>
      </div>

      {loading && (
        <div className="spinner-wrap section-gap"><div className="spinner" />Processing URLs...</div>
      )}

      {result && !loading && (
        <>
          <div className="grid-4 section-gap">
            <div className="stat-box stat-cyan">
              <div className="stat-value">{result.original}</div>
              <div className="stat-label">Input URLs</div>
            </div>
            <div className="stat-box stat-green">
              <div className="stat-value">{result.cleaned}</div>
              <div className="stat-label">Clean URLs</div>
            </div>
            <div className="stat-box stat-orange">
              <div className="stat-value">{result.duplicatesRemoved}</div>
              <div className="stat-label">Duplicates Removed</div>
            </div>
            <div className="stat-box stat-danger">
              <div className="stat-value">{result.blockedRemoved}</div>
              <div className="stat-label">Blocked / Invalid</div>
            </div>
          </div>

          <div className="grid-2 section-gap">
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: 'var(--accent-green)' }} />
                  Clean URLs ({result.cleaned})
                </span>
                <CopyButton text={result.cleanUrls.join('\n')} />
              </div>
              {result.cleanUrls.length > 0 ? (
                <div className="output-box" style={{ color: 'var(--accent-cyan)' }}>
                  {result.cleanUrls.join('\n')}
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon">📭</div>No clean URLs remain</div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: 'var(--danger)' }} />
                  Removed URLs ({result.removedUrls.length})
                </span>
              </div>
              {result.removedUrls.length > 0 ? (
                <div className="output-box" style={{ color: 'var(--danger)', opacity: 0.7 }}>
                  {result.removedUrls.join('\n')}
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon">✅</div>Nothing was removed</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

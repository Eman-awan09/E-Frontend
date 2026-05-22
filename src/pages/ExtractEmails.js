import { useState } from 'react';
import { urlAPI } from '../api';
import CopyButton from '../components/CopyButton';

export default function ExtractEmails() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPerUrl, setShowPerUrl] = useState(false);

  const handleExtract = async () => {
    if (!input.trim()) return setError('Please paste some URLs first.');
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await urlAPI.extractEmails(input);
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

  const urlCount = input.split(/\n/).filter(l => l.trim()).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Extract <span className="highlight">Emails</span> from URLs</h1>
        <p className="page-subtitle">// crawls each URL and extracts all emails — no duplicates</p>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span className="dot" />Target URLs</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {urlCount} URL{urlCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="textarea-wrapper">
          <textarea
            className="tool-textarea"
            rows={8}
            placeholder={"One URL per line:\n\nhttps://example.com/contact\nhttps://company.com/about\nhttps://business.org/team"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 'var(--radius)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
          ⏱ Each URL may take a few seconds to fetch. Be patient for large batches.
        </div>
        <div className="btn-actions">
          <button className="btn btn-orange" onClick={handleExtract} disabled={loading || !input.trim()}>
            {loading ? '⏳ Extracting...' : '🔎 Extract Emails'}
          </button>
          <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>✕ Clear</button>
        </div>
      </div>

      {loading && (
        <div className="spinner-wrap section-gap">
          <div className="spinner" />
          Crawling URLs and extracting emails... This may take a moment.
        </div>
      )}

      {result && !loading && (
        <>
          <div className="grid-3 section-gap">
            <div className="stat-box stat-cyan">
              <div className="stat-value">{result.totalUrls}</div>
              <div className="stat-label">URLs Crawled</div>
            </div>
            <div className="stat-box stat-green">
              <div className="stat-value">{result.totalEmailsFound}</div>
              <div className="stat-label">Unique Emails Found</div>
            </div>
            <div className="stat-box stat-danger">
              <div className="stat-value">{result.perUrlResults.filter(r => r.status === 'error').length}</div>
              <div className="stat-label">Failed URLs</div>
            </div>
          </div>

          {/* All unique emails */}
          <div className="card section-gap">
            <div className="card-header">
              <span className="card-title">
                <span className="dot" style={{ background: 'var(--accent-green)' }} />
                All Unique Emails ({result.totalEmailsFound})
              </span>
              <CopyButton text={result.allUniqueEmails.join('\n')} />
            </div>
            {result.allUniqueEmails.length > 0 ? (
              <div className="output-box" style={{ color: 'var(--accent-green)' }}>
                {result.allUniqueEmails.join('\n')}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                No emails found across the provided URLs
              </div>
            )}
          </div>

          {/* Per-URL breakdown */}
          <div className="card section-gap">
            <div className="card-header">
              <span className="card-title">
                <span className="dot" style={{ background: '#a78bfa' }} />
                Per-URL Breakdown
              </span>
              <button
                className="btn btn-ghost"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
                onClick={() => setShowPerUrl(!showPerUrl)}
              >
                {showPerUrl ? '▲ Hide' : '▼ Show'}
              </button>
            </div>
            {showPerUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                {result.perUrlResults.map((r, i) => (
                  <div className="url-result-item" key={i}>
                    <div className="url-result-header">
                      <span className="url-result-url">{r.url}</span>
                      {r.status === 'success'
                        ? <span className="url-status-ok">✓ {r.emails.length} email{r.emails.length !== 1 ? 's' : ''}</span>
                        : <span className="url-status-err">✗ Failed</span>
                      }
                    </div>
                    {r.status === 'error' && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--danger)', opacity: 0.7 }}>
                        {r.error}
                      </div>
                    )}
                    {r.emails.length > 0 && (
                      <div className="url-emails-found">
                        {r.emails.map((e, j) => <span className="email-chip" key={j}>{e}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

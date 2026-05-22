import { useState } from 'react';
import { emailAPI } from '../api';
import CopyButton from '../components/CopyButton';

export default function RemoveDuplicates() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatedList, setUpdatedList] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) return setError('Please paste some emails first.');
    setError('');
    setResult(null);
    setUpdatedList('');
    setLoading(true);
    try {
      const { data } = await emailAPI.removeDuplicates(input);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDuplicates = () => {
    if (!result) return;
    setUpdatedList(result.uniqueEmails.join('\n'));
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
    setUpdatedList('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Remove <span className="highlight">Duplicate</span> Emails</h1>
        <p className="page-subtitle">// paste bulk emails → get unique + duplicate analysis</p>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span className="dot" />Input Emails</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {input.split(/\s+/).filter(Boolean).length} tokens
          </span>
        </div>
        <div className="textarea-wrapper">
          <textarea
            className="tool-textarea"
            rows={9}
            placeholder={"Paste emails here, one per line or separated by commas/spaces...\n\nexample@gmail.com\ntest@domain.com\nexample@gmail.com"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div className="btn-actions">
          <button className="btn btn-primary" onClick={handleProcess} disabled={loading || !input.trim()}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Emails'}
          </button>
          <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>
            ✕ Clear
          </button>
        </div>
      </div>

      {loading && (
        <div className="spinner-wrap section-gap">
          <div className="spinner" />
          Processing emails...
        </div>
      )}

      {result && !loading && (
        <>
          {/* Stats Row */}
          <div className="grid-4 section-gap">
            <div className="stat-box stat-cyan">
              <div className="stat-value">{result.totalEmails}</div>
              <div className="stat-label">Total Emails</div>
            </div>
            <div className="stat-box stat-green">
              <div className="stat-value">{result.uniqueCount}</div>
              <div className="stat-label">Unique Emails</div>
            </div>
            <div className="stat-box stat-danger">
              <div className="stat-value">{result.duplicateCount}</div>
              <div className="stat-label">Duplicate Types</div>
            </div>
            <div className="stat-box stat-orange">
              <div className="stat-value">{result.totalEmails - result.uniqueCount}</div>
              <div className="stat-label">Duplicate Entries</div>
            </div>
          </div>

          <div className="grid-2 section-gap">
            {/* Unique Emails */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: 'var(--accent-green)' }} />
                  Unique Emails ({result.uniqueCount})
                </span>
                <CopyButton text={result.uniqueEmails.join('\n')} />
              </div>
              {result.uniqueEmails.length > 0 ? (
                <div className="output-box" style={{ color: 'var(--accent-green)' }}>
                  {result.uniqueEmails.join('\n')}
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon">📭</div>No unique emails found</div>
              )}
            </div>

            {/* Duplicates */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: 'var(--danger)' }} />
                  Duplicate Emails ({result.duplicateCount})
                </span>
              </div>
              {result.duplicates.length > 0 ? (
                <div className="dup-list">
                  {result.duplicates.map((d, i) => (
                    <div className="dup-item" key={i}>
                      <span className="dup-email">{d.email}</span>
                      <span className="dup-count">×{d.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon">✅</div>No duplicates found!</div>
              )}
            </div>
          </div>

          {/* Remove Duplicates Action */}
          <div className="card section-gap">
            <div className="card-header">
              <span className="card-title">
                <span className="dot" style={{ background: 'var(--accent-orange)' }} />
                Updated Emails List
              </span>
              {updatedList && <CopyButton text={updatedList} />}
            </div>

            {!updatedList ? (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
                  Click below to generate the cleaned list without any duplicates
                </p>
                <button className="btn btn-danger" onClick={handleRemoveDuplicates}>
                  🗑 Remove Duplicates
                </button>
              </div>
            ) : (
              <>
                <div className="output-box" style={{ color: 'var(--accent-cyan)' }}>
                  {updatedList}
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-danger" onClick={handleRemoveDuplicates}>
                    🔄 Regenerate
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { emailAPI } from '../api';
import CopyButton from '../components/CopyButton';

export default function ShuffleEmails() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shuffleCount, setShuffleCount] = useState(0);

  const handleShuffle = async () => {
    if (!input.trim()) return setError('Please paste some emails first.');
    setError('');
    setLoading(true);
    try {
      const { data } = await emailAPI.shuffle(input);
      setResult(data);
      setShuffleCount(c => c + 1);
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
    setShuffleCount(0);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shuffle <span className="highlight">Emails</span></h1>
        <p className="page-subtitle">// randomize email order using Fisher-Yates algorithm</p>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span className="dot" />Input Emails</span>
          {shuffleCount > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#a78bfa' }}>
              🔀 Shuffled {shuffleCount}×
            </span>
          )}
        </div>
        <div className="textarea-wrapper">
          <textarea
            className="tool-textarea"
            rows={9}
            placeholder={"Paste emails here, one per line:\n\nalice@example.com\nbob@company.com\ncharlie@domain.org\ndave@email.net"}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div className="btn-actions">
          <button
            className="btn"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff' }}
            onClick={handleShuffle}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳ Shuffling...' : '🔀 Shuffle Emails'}
          </button>
          {result && (
            <button
              className="btn"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff' }}
              onClick={handleShuffle}
              disabled={loading}
            >
              🎲 Shuffle Again
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>✕ Clear</button>
        </div>
      </div>

      {loading && (
        <div className="spinner-wrap section-gap"><div className="spinner" />Shuffling...</div>
      )}

      {result && !loading && (
        <>
          <div className="grid-3 section-gap">
            <div className="stat-box stat-purple">
              <div className="stat-value">{result.total}</div>
              <div className="stat-label">Total Emails</div>
            </div>
            <div className="stat-box" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: '#a78bfa' }}>{shuffleCount}</div>
              <div className="stat-label">Times Shuffled</div>
            </div>
            <div className="stat-box stat-cyan">
              <div className="stat-value">{result.total}</div>
              <div className="stat-label">Output Emails</div>
            </div>
          </div>

          <div className="grid-2 section-gap">
            {/* Original */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: 'var(--text-muted)' }} />
                  Original Order
                </span>
                <CopyButton text={result.original.join('\n')} />
              </div>
              <div className="output-box" style={{ color: 'var(--text-secondary)' }}>
                {result.original.join('\n')}
              </div>
            </div>

            {/* Shuffled */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <span className="dot" style={{ background: '#a78bfa' }} />
                  Shuffled Order
                </span>
                <CopyButton text={result.shuffled.join('\n')} />
              </div>
              <div className="output-box" style={{ color: '#a78bfa' }}>
                {result.shuffled.join('\n')}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

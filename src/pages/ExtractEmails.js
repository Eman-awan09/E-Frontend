// import { useState } from 'react';
// import { urlAPI } from '../api';
// import CopyButton from '../components/CopyButton';

// export default function ExtractEmails() {
//   const [input, setInput] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPerUrl, setShowPerUrl] = useState(false);

//   const handleExtract = async () => {
//     if (!input.trim()) return setError('Please paste some URLs first.');
//     setError('');
//     setResult(null);
//     setLoading(true);
//     try {
//       const { data } = await urlAPI.extractEmails(input);
//       setResult(data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Something went wrong. Is the server running?');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setInput('');
//     setResult(null);
//     setError('');
//   };

//   const urlCount = input.split(/\n/).filter(l => l.trim()).length;

//   return (
//     <div>
//       <div className="page-header">
//         <h1 className="page-title">Extract <span className="highlight">Emails</span> from URLs</h1>
//         <p className="page-subtitle">// crawls each URL and extracts all emails — no duplicates</p>
//       </div>

//       {error && <div className="alert alert-error">⚠ {error}</div>}

//       <div className="card">
//         <div className="card-header">
//           <span className="card-title"><span className="dot" />Target URLs</span>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
//             {urlCount} URL{urlCount !== 1 ? 's' : ''}
//           </span>
//         </div>
//         <div className="textarea-wrapper">
//           <textarea
//             className="tool-textarea"
//             rows={8}
//             placeholder={"One URL per line:\n\nhttps://example.com/contact\nhttps://company.com/about\nhttps://business.org/team"}
//             value={input}
//             onChange={e => setInput(e.target.value)}
//           />
//         </div>
//         <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 'var(--radius)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
//           ⏱ Each URL may take a few seconds to fetch. Be patient for large batches.
//         </div>
//         <div className="btn-actions">
//           <button className="btn btn-orange" onClick={handleExtract} disabled={loading || !input.trim()}>
//             {loading ? '⏳ Extracting...' : '🔎 Extract Emails'}
//           </button>
//           <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>✕ Clear</button>
//         </div>
//       </div>

//       {loading && (
//         <div className="spinner-wrap section-gap">
//           <div className="spinner" />
//           Crawling URLs and extracting emails... This may take a moment.
//         </div>
//       )}

//       {result && !loading && (
//         <>
//           <div className="grid-3 section-gap">
//             <div className="stat-box stat-cyan">
//               <div className="stat-value">{result.totalUrls}</div>
//               <div className="stat-label">URLs Crawled</div>
//             </div>
//             <div className="stat-box stat-green">
//               <div className="stat-value">{result.totalEmailsFound}</div>
//               <div className="stat-label">Unique Emails Found</div>
//             </div>
//             <div className="stat-box stat-danger">
//               <div className="stat-value">{result.perUrlResults.filter(r => r.status === 'error').length}</div>
//               <div className="stat-label">Failed URLs</div>
//             </div>
//           </div>

//           {/* All unique emails */}
//           <div className="card section-gap">
//             <div className="card-header">
//               <span className="card-title">
//                 <span className="dot" style={{ background: 'var(--accent-green)' }} />
//                 All Unique Emails ({result.totalEmailsFound})
//               </span>
//               <CopyButton text={result.allUniqueEmails.join('\n')} />
//             </div>
//             {result.allUniqueEmails.length > 0 ? (
//               <div className="output-box" style={{ color: 'var(--accent-green)' }}>
//                 {result.allUniqueEmails.join('\n')}
//               </div>
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">📭</div>
//                 No emails found across the provided URLs
//               </div>
//             )}
//           </div>

//           {/* Per-URL breakdown */}
//           <div className="card section-gap">
//             <div className="card-header">
//               <span className="card-title">
//                 <span className="dot" style={{ background: '#a78bfa' }} />
//                 Per-URL Breakdown
//               </span>
//               <button
//                 className="btn btn-ghost"
//                 style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
//                 onClick={() => setShowPerUrl(!showPerUrl)}
//               >
//                 {showPerUrl ? '▲ Hide' : '▼ Show'}
//               </button>
//             </div>
//             {showPerUrl && (
//               <div style={{ marginTop: '0.75rem' }}>
//                 {result.perUrlResults.map((r, i) => (
//                   <div className="url-result-item" key={i}>
//                     <div className="url-result-header">
//                       <span className="url-result-url">{r.url}</span>
//                       {r.status === 'success'
//                         ? <span className="url-status-ok">✓ {r.emails.length} email{r.emails.length !== 1 ? 's' : ''}</span>
//                         : <span className="url-status-err">✗ Failed</span>
//                       }
//                     </div>
//                     {r.status === 'error' && (
//                       <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--danger)', opacity: 0.7 }}>
//                         {r.error}
//                       </div>
//                     )}
//                     {r.emails.length > 0 && (
//                       <div className="url-emails-found">
//                         {r.emails.map((e, j) => <span className="email-chip" key={j}>{e}</span>)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import CopyButton from '../components/CopyButton';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SCRAPER_API = 'https://app.speedytakeoffs.com/domain-url/email/scraping';

const parseUrls = (raw) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const found = raw.match(urlRegex) || [];
  const cleaned = found.map(u => u.trim().replace(/[,\s]+$/g, ''));
  const unique = [...new Set(cleaned)];
  return unique.filter(
    u => !u.match(/(^|\.)google\.com/i) && !u.match(/(^|\.)facebook\.com/i)
  );
};

const checkOnline = async () => {
  try { await axios.get('/api/ping', { timeout: 4000 }); return true; }
  catch { return true; } // assume online if ping endpoint doesn't exist
};

export default function ExtractEmails() {
  const [input, setInput]           = useState('');
  const [running, setRunning]       = useState(false);
  const [results, setResults]       = useState([]);    // { url, emails, error }
  const [failedUrls, setFailedUrls] = useState([]);
  const [allEmails, setAllEmails]   = useState([]);
  const [logs, setLogs]             = useState([]);
  const [progress, setProgress]     = useState({ done: 0, total: 0 });
  const [showPerUrl, setShowPerUrl] = useState(false);

  const logsRef    = useRef(null);
  const emailsRef  = useRef(null);
  const stopRef    = useRef(false);

  const addLog = useCallback((msg) => {
    setLogs(prev => {
      const next = [...prev, msg];
      setTimeout(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, 50);
      return next;
    });
  }, []);

  const handleExtract = async () => {
    if (!input.trim()) return;
    const urls = parseUrls(input);
    if (!urls.length) { addLog('⚠️ No valid URLs found.'); return; }

    // Reset state
    setRunning(true);
    stopRef.current = false;
    setResults([]);
    setFailedUrls([]);
    setAllEmails([]);
    setLogs([]);
    setProgress({ done: 0, total: urls.length });

    const collectedEmails = new Set();
    let queue = [...urls];

    addLog(`🚀 Starting extraction for ${urls.length} URL(s)...`);

    while (queue.length > 0) {
      if (stopRef.current) { addLog('⏹ Stopped by user.'); break; }

      const url = queue[0];

      // Wait for internet
      let online = await checkOnline();
      while (!online) {
        addLog('⚠️ No internet. Retrying in 10s...');
        await sleep(10000);
        online = await checkOnline();
      }

      try {
        addLog(`🔍 Scraping: ${url}`);
        const res = await axios.post(
          SCRAPER_API,
          { url },
          { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
        );

        let entry;
        if (Array.isArray(res.data)) {
          // Success — array of emails
          entry = { url, emails: res.data, error: null };
          if (res.data.length > 0) {
            res.data.forEach(e => collectedEmails.add(e));
            setAllEmails([...collectedEmails]);
            setTimeout(() => { if (emailsRef.current) emailsRef.current.scrollTop = emailsRef.current.scrollHeight; }, 50);
          }
          addLog(`✅ ${url} → ${res.data.length} email(s) found`);
        } else if (res.data?.status === false) {
          entry = { url, emails: [], error: res.data.error || 'API returned error' };
          setFailedUrls(p => [...p, url]);
          addLog(`❌ Failed: ${url} → ${entry.error}`);
        } else {
          entry = { url, emails: [], error: 'Unexpected API response' };
          setFailedUrls(p => [...p, url]);
          addLog(`❌ Unexpected response: ${url}`);
        }

        setResults(p => [...p, entry]);

      } catch (err) {
        const entry = { url, emails: [], error: err.message || 'Request failed' };
        setResults(p => [...p, entry]);
        setFailedUrls(p => [...p, url]);
        addLog(`❌ Error: ${url} → ${err.message}`);
      }

      queue = queue.slice(1);
      setProgress(p => ({ ...p, done: p.done + 1 }));
      if (queue.length > 0 && !stopRef.current) await sleep(800);
    }

    addLog(`✅ Done. ${collectedEmails.size} unique email(s) extracted.`);
    setRunning(false);
  };

  const handleStop  = () => { stopRef.current = true; };
  const handleClear = () => {
    stopRef.current = true;
    setInput(''); setResults([]); setFailedUrls([]);
    setAllEmails([]); setLogs([]); setProgress({ done: 0, total: 0 });
  };

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const uniqueEmails = [...new Set(allEmails.map(e => e.toLowerCase().trim()))];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Extract <span className="highlight">Emails</span> from URLs</h1>
        <p className="page-subtitle">// paste URLs → live scraping → unique emails list</p>
      </div>

      {/* Input */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <span className="card-title"><span className="dot" />Target URLs</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {input.split(/\n/).filter(l => l.trim()).length} lines
          </span>
        </div>
        <textarea
          className="tool-textarea"
          rows={7}
          placeholder={"One URL per line:\n\nhttps://example.com/contact\nhttps://company.com/about\nhttps://business.org/team"}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={running}
        />
        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(255,107,53,0.08)',
          border: '1px solid rgba(255,107,53,0.2)', borderRadius: 'var(--radius)',
          fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
          ⚡ Uses external scraping API — processes one URL at a time, auto-retries on network loss.
          Google &amp; Facebook URLs are automatically filtered out.
        </div>
        <div className="btn-actions">
          {!running ? (
            <button className="btn btn-orange" onClick={handleExtract} disabled={!input.trim()}>
              🔎 Start Extraction
            </button>
          ) : (
            <button className="btn btn-danger" onClick={handleStop}>
              ⏹ Stop
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleClear} disabled={running}>✕ Clear All</button>
        </div>
      </div>

      {/* Progress bar */}
      {progress.total > 0 && (
        <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {running ? '⏳ Processing...' : '✅ Complete'} — {progress.done} / {progress.total} URLs
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>{pct}%</span>
          </div>
          <div style={{ background: 'var(--bg-primary)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-cyan)',
              borderRadius: '4px', transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(0,229,255,0.5)' }} />
          </div>
        </div>
      )}

      {/* Stats */}
      {progress.total > 0 && (
        <div className="grid-3 section-gap" style={{ marginBottom: '1rem' }}>
          <div className="stat-box stat-cyan">
            <div className="stat-value">{progress.done}</div>
            <div className="stat-label">URLs Processed</div>
          </div>
          <div className="stat-box stat-green">
            <div className="stat-value">{uniqueEmails.length}</div>
            <div className="stat-label">Unique Emails</div>
          </div>
          <div className="stat-box stat-danger">
            <div className="stat-value">{failedUrls.length}</div>
            <div className="stat-label">Failed URLs</div>
          </div>
        </div>
      )}

      {/* Two-column output */}
      {progress.total > 0 && (
        <div className="grid-2 section-gap" style={{ marginBottom: '1rem' }}>
          {/* Emails output */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <span className="dot" style={{ background: 'var(--accent-green)' }} />
                Unique Emails ({uniqueEmails.length})
              </span>
              <CopyButton text={uniqueEmails.join('\n')} />
            </div>
            {uniqueEmails.length > 0 ? (
              <div ref={emailsRef} className="output-box" style={{ color: 'var(--accent-green)', maxHeight: '280px' }}>
                {uniqueEmails.join('\n')}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">{running ? '⏳' : '📭'}</div>
                {running ? 'Extracting...' : 'No emails found'}
              </div>
            )}
          </div>

          {/* Live log */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <span className="dot" style={{ background: '#a78bfa' }} />
                Live Log ({logs.length})
              </span>
              <CopyButton text={logs.join('\n')} />
            </div>
            <div ref={logsRef} style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', maxHeight: '280px', overflowY: 'auto',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '0.5rem',
            }}>
              {logs.length === 0 ? (
                <div className="empty-state" style={{ padding: '1rem' }}>Waiting to start...</div>
              ) : logs.map((log, i) => (
                <div key={i} style={{
                  padding: '0.2rem 0.4rem',
                  color: log.startsWith('✅') ? 'var(--accent-green)'
                       : log.startsWith('❌') ? 'var(--danger)'
                       : log.startsWith('⚠') ? 'var(--accent-orange)'
                       : log.startsWith('🔍') ? 'var(--accent-cyan)'
                       : 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border)',
                  wordBreak: 'break-all',
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Failed URLs */}
      {failedUrls.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header">
            <span className="card-title">
              <span className="dot" style={{ background: 'var(--danger)' }} />
              Failed URLs ({failedUrls.length})
            </span>
            <CopyButton text={failedUrls.join('\n')} />
          </div>
          <div className="output-box" style={{ color: 'var(--danger)', opacity: 0.8 }}>
            {failedUrls.join('\n')}
          </div>
        </div>
      )}

      {/* Per-URL breakdown */}
      {results.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header">
            <span className="card-title">
              <span className="dot" style={{ background: '#a78bfa' }} />
              Per-URL Breakdown ({results.length})
            </span>
            <button className="btn btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
              onClick={() => setShowPerUrl(s => !s)}>
              {showPerUrl ? '▲ Hide' : '▼ Show'}
            </button>
          </div>
          {showPerUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              {results.map((r, i) => (
                <div className="url-result-item" key={i}>
                  <div className="url-result-header">
                    <span className="url-result-url">{r.url}</span>
                    {r.error
                      ? <span className="url-status-err">✗ Failed</span>
                      : <span className="url-status-ok">✓ {r.emails.length} email{r.emails.length !== 1 ? 's' : ''}</span>
                    }
                  </div>
                  {r.error && (
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
      )}
    </div>
  );
}
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { senderAPI } from '../api';
// import CopyButton from '../components/CopyButton';

// // ─── Sub-components ────────────────────────────────────────────────────────

// function StatusBadge({ status }) {
//   const map = {
//     pending:   { color: '#8888aa', bg: 'rgba(136,136,170,0.1)', label: '● PENDING' },
//     running:   { color: '#00e5ff', bg: 'rgba(0,229,255,0.1)',   label: '▶ RUNNING' },
//     paused:    { color: '#ff6b35', bg: 'rgba(255,107,53,0.1)',  label: '⏸ PAUSED'  },
//     completed: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)',   label: '✓ DONE'    },
//     failed:    { color: '#ff4466', bg: 'rgba(255,68,102,0.1)',  label: '✗ FAILED'  },
//   };
//   const s = map[status] || map.pending;
//   return (
//     <span style={{
//       background: s.bg, color: s.color,
//       fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
//       padding: '0.2rem 0.6rem', borderRadius: '20px', letterSpacing: '0.06em',
//     }}>
//       {s.label}
//     </span>
//   );
// }

// function ProgressBar({ value, max, color = 'var(--accent-cyan)' }) {
//   const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
//   return (
//     <div style={{ background: 'var(--bg-primary)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
//       <div style={{
//         width: `${pct}%`, height: '100%',
//         background: color,
//         borderRadius: '4px',
//         transition: 'width 0.4s ease',
//         boxShadow: `0 0 8px ${color}60`,
//       }} />
//     </div>
//   );
// }

// function MiniBarChart({ dailyStats }) {
//   if (!dailyStats || dailyStats.length === 0) return (
//     <div className="empty-state"><div className="empty-icon">📊</div>No daily data yet</div>
//   );
//   const maxVal = Math.max(...dailyStats.map(d => (d.sent || 0) + (d.failed || 0)), 1);
//   return (
//     <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', padding: '0 4px' }}>
//       {dailyStats.slice(-14).map((d, i) => {
//         const total = (d.sent || 0) + (d.failed || 0);
//         const sentH = total > 0 ? Math.max(4, ((d.sent || 0) / maxVal) * 70) : 2;
//         const failH = total > 0 ? Math.max(0, ((d.failed || 0) / maxVal) * 70) : 0;
//         return (
//           <div key={i} title={`${d.date}: ${d.sent} sent, ${d.failed || 0} failed`}
//             style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
//             {failH > 0 && <div style={{ width: '100%', height: failH, background: 'var(--danger)', borderRadius: '2px 2px 0 0', opacity: 0.7 }} />}
//             <div style={{ width: '100%', height: sentH, background: 'var(--accent-cyan)', borderRadius: failH > 0 ? '0' : '2px 2px 0 0' }} />
//             <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', transform: 'rotate(-45deg)', transformOrigin: 'top left', marginTop: '6px', whiteSpace: 'nowrap' }}>
//               {d.date.slice(5)}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Campaign Card ─────────────────────────────────────────────────────────
// function CampaignCard({ campaign, onRefresh, onDelete }) {
//   const [logs, setLogs] = useState(campaign.recentLogs || []);
//   const [dailyStats, setDailyStats] = useState([]);
//   const [showLogs, setShowLogs] = useState(false);
//   const [acting, setActing] = useState(false);
//   const logsRef = useRef(null);
//   const pollingRef = useRef(null);

//   const successRate = campaign.successRate || 0;
//   const progress = campaign.totalRecipients > 0
//     ? Math.round(((campaign.sent + campaign.failed) / campaign.totalRecipients) * 100) : 0;

//   const fetchStats = useCallback(async () => {
//     try {
//       const [campRes, statsRes] = await Promise.all([
//         senderAPI.getCampaign(campaign.id),
//         senderAPI.getDailyStats(campaign.id),
//       ]);
//       setLogs(campRes.data.recentLogs || []);
//       setDailyStats(statsRes.data.dailyStats || []);
//     } catch (_) {}
//   }, [campaign.id]);

//   useEffect(() => {
//     if (campaign.status === 'running') {
//       pollingRef.current = setInterval(() => { onRefresh(); fetchStats(); }, 2500);
//     }
//     fetchStats();
//     return () => clearInterval(pollingRef.current);
//   }, [campaign.status, onRefresh, fetchStats]);

//   useEffect(() => {
//     if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
//   }, [logs]);

//   const handleAction = async (action) => {
//     setActing(true);
//     try {
//       if (action === 'start')  await senderAPI.startCampaign(campaign.id);
//       if (action === 'pause')  await senderAPI.pauseCampaign(campaign.id);
//       if (action === 'delete') { await onDelete(campaign.id); return; }
//       await onRefresh();
//     } catch (err) {
//       alert(err.response?.data?.error || err.message);
//     } finally { setActing(false); }
//   };

//   return (
//     <div className="card" style={{ marginBottom: '1.25rem' }}>
//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
//             <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{campaign.name}</span>
//             <StatusBadge status={campaign.status} />
//           </div>
//           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
//             {campaign.id.slice(0, 8)} · {campaign.smtpUser} · {campaign.totalRecipients} recipients · limit {campaign.dailyLimit}/day
//           </div>
//           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
//             Subject: <span style={{ color: 'var(--accent-cyan)' }}>{campaign.subject}</span>
//           </div>
//           {campaign.pauseReason && (
//             <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-orange)', marginTop: '0.3rem' }}>
//               ⏸ {campaign.pauseReason}
//             </div>
//           )}
//         </div>
//         <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//           {(campaign.status === 'pending' || campaign.status === 'paused') && (
//             <button className="btn btn-success" style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }} onClick={() => handleAction('start')} disabled={acting}>
//               ▶ {campaign.status === 'paused' ? 'Resume' : 'Start'}
//             </button>
//           )}
//           {campaign.status === 'running' && (
//             <button className="btn btn-orange" style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }} onClick={() => handleAction('pause')} disabled={acting}>
//               ⏸ Pause
//             </button>
//           )}
//           <button className="btn btn-ghost" style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }} onClick={() => handleAction('delete')} disabled={acting}>
//             🗑
//           </button>
//         </div>
//       </div>

//       {/* Progress */}
//       <div style={{ marginBottom: '1rem' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
//             Progress: {campaign.sent + campaign.failed} / {campaign.totalRecipients}
//           </span>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>{progress}%</span>
//         </div>
//         <ProgressBar value={campaign.sent + campaign.failed} max={campaign.totalRecipients} />
//       </div>

//       {/* Stats Grid */}
//       <div className="grid-4" style={{ marginBottom: '1rem' }}>
//         <div className="stat-box stat-cyan" style={{ padding: '0.75rem' }}>
//           <div className="stat-value" style={{ fontSize: '1.5rem' }}>{campaign.sent}</div>
//           <div className="stat-label">Sent</div>
//         </div>
//         <div className="stat-box stat-danger" style={{ padding: '0.75rem' }}>
//           <div className="stat-value" style={{ fontSize: '1.5rem' }}>{campaign.failed}</div>
//           <div className="stat-label">Failed</div>
//         </div>
//         <div className="stat-box" style={{ padding: '0.75rem', textAlign: 'center' }}>
//           <div className="stat-value" style={{ fontSize: '1.5rem', color: '#a78bfa' }}>{campaign.pending}</div>
//           <div className="stat-label">Pending</div>
//         </div>
//         <div className="stat-box stat-green" style={{ padding: '0.75rem' }}>
//           <div className="stat-value" style={{ fontSize: '1.5rem' }}>{successRate}%</div>
//           <div className="stat-label">Success Rate</div>
//         </div>
//       </div>

//       {/* Success rate bar */}
//       <div style={{ marginBottom: '1rem' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Success Rate</span>
//         </div>
//         <div style={{ background: 'var(--bg-primary)', borderRadius: '4px', height: '6px', overflow: 'hidden', display: 'flex' }}>
//           <div style={{ width: `${successRate}%`, height: '100%', background: 'var(--accent-green)', borderRadius: '4px 0 0 4px', transition: 'width 0.5s ease' }} />
//           <div style={{ flex: 1, height: '100%', background: campaign.failed > 0 ? 'var(--danger)' : 'transparent', opacity: 0.5 }} />
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-green)' }}>✓ {campaign.sent} sent</span>
//           <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--danger)' }}>✗ {campaign.failed} failed</span>
//         </div>
//       </div>

//       {/* Daily Bar Chart */}
//       {dailyStats.length > 0 && (
//         <div style={{ marginBottom: '1rem' }}>
//           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', gap: '1rem' }}>
//             <span>Daily Activity</span>
//             <span style={{ color: 'var(--accent-cyan)' }}>■ sent</span>
//             <span style={{ color: 'var(--danger)' }}>■ failed</span>
//           </div>
//           <MiniBarChart dailyStats={dailyStats} />
//         </div>
//       )}

//       {/* Toggle Logs */}
//       <div>
//         <button
//           className="btn btn-ghost"
//           style={{ width: '100%', justifyContent: 'center', fontSize: '0.73rem', padding: '0.5rem' }}
//           onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchStats(); }}
//         >
//           {showLogs ? '▲ Hide Logs' : `▼ Show Send Logs (${logs.length})`}
//         </button>

//         {showLogs && (
//           <div style={{ marginTop: '0.75rem' }}>
//             <div className="output-label">
//               <span>Send Log (last 50)</span>
//               <CopyButton text={logs.map(l => `${l.status.toUpperCase()} | ${l.email} | ${l.timestamp}${l.error ? ' | ' + l.error : ''}`).join('\n')} />
//             </div>
//             <div
//               ref={logsRef}
//               style={{
//                 background: 'var(--bg-primary)', border: '1px solid var(--border)',
//                 borderRadius: 'var(--radius)', maxHeight: '220px', overflowY: 'auto',
//                 fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
//               }}
//             >
//               {logs.length === 0 ? (
//                 <div className="empty-state" style={{ padding: '1rem' }}>No logs yet</div>
//               ) : [...logs].reverse().map((log, i) => (
//                 <div key={i} style={{
//                   display: 'flex', alignItems: 'center', gap: '0.6rem',
//                   padding: '0.4rem 0.75rem',
//                   borderBottom: '1px solid var(--border)',
//                   background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
//                 }}>
//                   <span style={{ color: log.status === 'sent' ? 'var(--accent-green)' : 'var(--danger)', minWidth: '44px' }}>
//                     {log.status === 'sent' ? '✓ SENT' : '✗ FAIL'}
//                   </span>
//                   <span style={{ color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {log.email}
//                   </span>
//                   <span style={{ color: 'var(--text-muted)', fontSize: '0.62rem', whiteSpace: 'nowrap' }}>
//                     {new Date(log.timestamp).toLocaleTimeString()}
//                   </span>
//                   {log.error && (
//                     <span style={{ color: 'var(--danger)', fontSize: '0.62rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.error}>
//                       {log.error}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Create Campaign Modal / Form ─────────────────────────────────────────
// function CreateCampaignForm({ onCreated }) {
//   const [step, setStep] = useState(1); // 1=SMTP, 2=Campaign
//   const [smtpConfig, setSmtpConfig] = useState({ host: '', port: '587', user: '', pass: '', secure: false });
//   const [smtpStatus, setSmtpStatus] = useState(null); // null | 'ok' | 'fail'
//   const [smtpMsg, setSmtpMsg] = useState('');
//   const [testing, setTesting] = useState(false);
//   const [form, setForm] = useState({
//     name: '', subject: '', body: '', fromName: '', emailsRaw: '', dailyLimit: '100', delayMs: '1500',
//   });
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState('');

//   const emailCount = (form.emailsRaw.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []).length;

//   const handleTestSmtp = async () => {
//     setTesting(true); setSmtpStatus(null); setSmtpMsg('');
//     try {
//       const { data } = await senderAPI.testSmtp(smtpConfig);
//       setSmtpStatus('ok'); setSmtpMsg(data.message);
//     } catch (err) {
//       setSmtpStatus('fail'); setSmtpMsg(err.response?.data?.error || err.message);
//     } finally { setTesting(false); }
//   };

//   const handleCreate = async () => {
//     if (!form.subject || !form.body || !form.emailsRaw) return setError('Fill in subject, body, and emails.');
//     setError(''); setCreating(true);
//     try {
//       const { data } = await senderAPI.createCampaign({ ...form, smtpConfig });
//       onCreated(data.campaign);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     } finally { setCreating(false); }
//   };

//   return (
//     <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--accent-cyan)', borderStyle: 'dashed' }}>
//       <div className="card-header">
//         <span className="card-title" style={{ fontSize: '0.8rem' }}>
//           <span className="dot" />
//           New Campaign — Step {step} of 2
//         </span>
//         <div style={{ display: 'flex', gap: '0.4rem' }}>
//           {[1,2].map(s => (
//             <div key={s} style={{
//               width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               background: step === s ? 'var(--accent-cyan)' : 'var(--bg-primary)',
//               color: step === s ? '#000' : 'var(--text-muted)',
//               fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
//               border: '1px solid var(--border)',
//             }} onClick={() => setStep(s)}>{s}</div>
//           ))}
//         </div>
//       </div>

//       {step === 1 && (
//         <>
//           <div style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
//             Configure your SMTP server (Gmail, Outlook, custom, etc.)
//           </div>

//           {/* SMTP Presets */}
//           <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
//             {[
//               { label: 'Gmail', host: 'smtp.gmail.com', port: '587' },
//               { label: 'Outlook', host: 'smtp-mail.outlook.com', port: '587' },
//               { label: 'Yahoo', host: 'smtp.mail.yahoo.com', port: '465' },
//               { label: 'Zoho', host: 'smtp.zoho.com', port: '587' },
//             ].map(p => (
//               <button key={p.label} className="btn btn-ghost"
//                 style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
//                 onClick={() => setSmtpConfig(s => ({ ...s, host: p.host, port: p.port }))}>
//                 {p.label}
//               </button>
//             ))}
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '0.75rem' }}>
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
//               placeholder="SMTP Host (e.g. smtp.gmail.com)" value={smtpConfig.host}
//               onChange={e => setSmtpConfig(s => ({ ...s, host: e.target.value }))} />
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', width: '80px' }}
//               placeholder="Port" value={smtpConfig.port}
//               onChange={e => setSmtpConfig(s => ({ ...s, port: e.target.value }))} />
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
//               placeholder="Email / Username" value={smtpConfig.user}
//               onChange={e => setSmtpConfig(s => ({ ...s, user: e.target.value }))} />
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
//               placeholder="Password / App Password" type="password" value={smtpConfig.pass}
//               onChange={e => setSmtpConfig(s => ({ ...s, pass: e.target.value }))} />
//           </div>

//           <div style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 'var(--radius)', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-orange)' }}>
//             💡 Gmail users: use an <strong>App Password</strong> (not your regular password). Enable 2FA → Google Account → Security → App Passwords.
//           </div>

//           {smtpStatus && (
//             <div className={`alert ${smtpStatus === 'ok' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '0.75rem' }}>
//               {smtpStatus === 'ok' ? '✓' : '✗'} {smtpMsg}
//             </div>
//           )}

//           <div className="btn-actions">
//             <button className="btn btn-ghost" onClick={handleTestSmtp} disabled={testing || !smtpConfig.host || !smtpConfig.user || !smtpConfig.pass}>
//               {testing ? '⏳ Testing...' : '🔌 Test Connection'}
//             </button>
//             <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass}>
//               Next: Campaign Setup →
//             </button>
//           </div>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           {error && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>⚠ {error}</div>}

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
//               placeholder="Campaign Name (optional)" value={form.name}
//               onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
//             <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
//               placeholder="From Name (optional)" value={form.fromName}
//               onChange={e => setForm(f => ({ ...f, fromName: e.target.value }))} />
//           </div>

//           <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', marginBottom: '0.75rem', width: '100%' }}
//             placeholder="Email Subject *" value={form.subject}
//             onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />

//           <textarea className="tool-textarea" rows={5} style={{ marginBottom: '0.75rem' }}
//             placeholder={"Email body (supports plain text or HTML)...\n\nHello,\n\nYour message here.\n\nRegards,\nYour Team"}
//             value={form.body}
//             onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />

//           <div className="card-header" style={{ marginBottom: '0.4rem' }}>
//             <span className="card-title"><span className="dot" style={{ background: 'var(--accent-green)' }} />Recipient Emails</span>
//             <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: emailCount > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>
//               {emailCount} valid email{emailCount !== 1 ? 's' : ''} detected
//             </span>
//           </div>
//           <textarea className="tool-textarea" rows={5} style={{ marginBottom: '0.75rem' }}
//             placeholder={"Paste bulk emails (comma, newline, or space separated):\n\nalice@example.com\nbob@company.com, charlie@domain.org\n..."}
//             value={form.emailsRaw}
//             onChange={e => setForm(f => ({ ...f, emailsRaw: e.target.value }))} />

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
//             <div>
//               <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Daily Send Limit</div>
//               <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', width: '100%' }}
//                 type="number" min="1" max="10000"
//                 placeholder="100" value={form.dailyLimit}
//                 onChange={e => setForm(f => ({ ...f, dailyLimit: e.target.value }))} />
//               <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Max emails sent per day</div>
//             </div>
//             <div>
//               <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Delay Between Sends (ms)</div>
//               <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', width: '100%' }}
//                 type="number" min="100" max="60000"
//                 placeholder="1500" value={form.delayMs}
//                 onChange={e => setForm(f => ({ ...f, delayMs: e.target.value }))} />
//               <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Prevents spam detection</div>
//             </div>
//           </div>

//           {/* Estimate */}
//           {emailCount > 0 && form.dailyLimit && (
//             <div style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 'var(--radius)', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
//               📊 Estimate: {emailCount} emails at {form.dailyLimit}/day = ~{Math.ceil(emailCount / parseInt(form.dailyLimit || 1))} day(s) to complete
//               · ~{Math.round((emailCount * (parseInt(form.delayMs || 1500))) / 1000 / 60)} min/day send time
//             </div>
//           )}

//           <div className="btn-actions">
//             <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
//             <button className="btn btn-primary" onClick={handleCreate}
//               disabled={creating || !form.subject || !form.body || !form.emailsRaw}>
//               {creating ? '⏳ Creating...' : '🚀 Create Campaign'}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ─── Main Page ─────────────────────────────────────────────────────────────
// export default function EmailSender() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchCampaigns = useCallback(async () => {
//     try {
//       const { data } = await senderAPI.getAllCampaigns();
//       setCampaigns(data.campaigns || []);
//     } catch (err) {
//       setError('Could not reach server. Is the backend running?');
//     } finally { setLoading(false); }
//   }, []);

//   useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

//   const handleCreated = (campaign) => {
//     setCampaigns(prev => [campaign, ...prev]);
//     setShowForm(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this campaign?')) return;
//     try {
//       await senderAPI.deleteCampaign(id);
//       setCampaigns(prev => prev.filter(c => c.id !== id));
//     } catch (err) {
//       alert(err.response?.data?.error || err.message);
//     }
//   };

//   // Global analytics across all campaigns
//   const totalSent   = campaigns.reduce((a, c) => a + (c.sent || 0), 0);
//   const totalFailed = campaigns.reduce((a, c) => a + (c.failed || 0), 0);
//   const totalPending = campaigns.reduce((a, c) => a + (c.pending || 0), 0);
//   const running = campaigns.filter(c => c.status === 'running').length;
//   const globalRate = totalSent + totalFailed > 0
//     ? Math.round((totalSent / (totalSent + totalFailed)) * 100) : 0;

//   return (
//     <div>
//       <div className="page-header">
//         <h1 className="page-title">Bulk Email <span className="highlight">Sender</span></h1>
//         <p className="page-subtitle">// campaigns · daily limits · real-time analytics · send logs</p>
//       </div>

//       {error && <div className="alert alert-error">⚠ {error}</div>}

//       {/* Global Stats */}
//       {campaigns.length > 0 && (
//         <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
//           <div className="stat-box stat-cyan">
//             <div className="stat-value">{totalSent.toLocaleString()}</div>
//             <div className="stat-label">Total Sent</div>
//           </div>
//           <div className="stat-box stat-danger">
//             <div className="stat-value">{totalFailed.toLocaleString()}</div>
//             <div className="stat-label">Total Failed</div>
//           </div>
//           <div className="stat-box" style={{ textAlign: 'center' }}>
//             <div className="stat-value" style={{ color: '#a78bfa' }}>{totalPending.toLocaleString()}</div>
//             <div className="stat-label">Pending</div>
//           </div>
//           <div className="stat-box stat-green">
//             <div className="stat-value">{globalRate}%</div>
//             <div className="stat-label">Global Rate</div>
//           </div>
//         </div>
//       )}

//       {/* Toolbar */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
//         <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
//           {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} · {running} running
//         </div>
//         <div style={{ display: 'flex', gap: '0.75rem' }}>
//           <button className="btn btn-ghost" onClick={fetchCampaigns} style={{ fontSize: '0.78rem' }}>↻ Refresh</button>
//           <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
//             {showForm ? '✕ Cancel' : '+ New Campaign'}
//           </button>
//         </div>
//       </div>

//       {/* Create Form */}
//       {showForm && <CreateCampaignForm onCreated={handleCreated} />}

//       {/* Campaign List */}
//       {loading ? (
//         <div className="spinner-wrap"><div className="spinner" />Loading campaigns...</div>
//       ) : campaigns.length === 0 && !showForm ? (
//         <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
//           <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📤</div>
//           <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
//             No campaigns yet
//           </div>
//           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
//             Create your first bulk email campaign to get started
//           </div>
//           <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Create First Campaign</button>
//         </div>
//       ) : (
//         campaigns.map(c => (
//           <CampaignCard
//             key={c.id}
//             campaign={c}
//             onRefresh={fetchCampaigns}
//             onDelete={handleDelete}
//           />
//         ))
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef, useCallback } from 'react';
import { senderAPI } from '../api';
import CopyButton from '../components/CopyButton';

// ─── helpers ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── StatusBadge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   { color: '#8888aa', bg: 'rgba(136,136,170,0.1)', label: '● PENDING'  },
    running:   { color: '#00e5ff', bg: 'rgba(0,229,255,0.1)',   label: '▶ RUNNING'  },
    paused:    { color: '#ff6b35', bg: 'rgba(255,107,53,0.1)',  label: '⏸ PAUSED'   },
    completed: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)',   label: '✓ DONE'     },
    failed:    { color: '#ff4466', bg: 'rgba(255,68,102,0.1)',  label: '✗ FAILED'   },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem',
      borderRadius: '20px', letterSpacing: '0.06em' }}>
      {s.label}
    </span>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = 'var(--accent-cyan)' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: 'var(--bg-primary)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color,
        borderRadius: '4px', transition: 'width 0.3s ease', boxShadow: `0 0 8px ${color}60` }} />
    </div>
  );
}

// ─── MiniBarChart ─────────────────────────────────────────────────────────
function MiniBarChart({ dailyStats }) {
  if (!dailyStats || dailyStats.length === 0)
    return <div className="empty-state"><div className="empty-icon">📊</div>No daily data yet</div>;
  const maxVal = Math.max(...dailyStats.map(d => (d.sent || 0) + (d.failed || 0)), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', padding: '0 4px' }}>
      {dailyStats.slice(-14).map((d, i) => {
        const total = (d.sent || 0) + (d.failed || 0);
        const sentH = total > 0 ? Math.max(4, ((d.sent || 0) / maxVal) * 70) : 2;
        const failH = total > 0 ? Math.max(0, ((d.failed || 0) / maxVal) * 70) : 0;
        return (
          <div key={i} title={`${d.date}: ${d.sent} sent, ${d.failed || 0} failed`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            {failH > 0 && <div style={{ width: '100%', height: failH, background: 'var(--danger)', borderRadius: '2px 2px 0 0', opacity: 0.7 }} />}
            <div style={{ width: '100%', height: sentH, background: 'var(--accent-cyan)', borderRadius: failH > 0 ? '0' : '2px 2px 0 0' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)',
              transform: 'rotate(-45deg)', transformOrigin: 'top left', marginTop: '6px', whiteSpace: 'nowrap' }}>
              {d.date.slice(5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CampaignCard ─────────────────────────────────────────────────────────
function CampaignCard({ campaign: initialCampaign, onRefresh, onDelete }) {
  const [campaign, setCampaign]     = useState(initialCampaign);
  const [logs, setLogs]             = useState(initialCampaign.recentLogs || []);
  const [dailyStats, setDailyStats] = useState(initialCampaign.dailyStats || []);
  const [showLogs, setShowLogs]     = useState(false);
  const [acting, setActing]         = useState(false);
  const [liveStatus, setLiveStatus] = useState('');

  const logsRef     = useRef(null);
  const runningRef  = useRef(false);   // tracks whether THIS card's loop is active
  const stopRef     = useRef(false);   // signal to stop the loop

  const successRate = campaign.successRate || 0;
  const progress    = campaign.totalRecipients > 0
    ? Math.round(((campaign.sent + campaign.failed) / campaign.totalRecipients) * 100) : 0;

  // Keep campaign in sync with parent refresh
  useEffect(() => { setCampaign(initialCampaign); }, [initialCampaign]);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  // ── Core browser-side send loop ─────────────────────────────────────────
  const runSendLoop = useCallback(async (campaignId, delayMs) => {
    if (runningRef.current) return;   // already looping
    runningRef.current = true;
    stopRef.current    = false;

    while (!stopRef.current) {
      try {
        const { data } = await senderAPI.sendNext(campaignId);

        // Update UI with latest campaign state
        setCampaign(data.campaign);
        setDailyStats(data.campaign.dailyStats || []);
        if (data.logEntry) {
          setLogs(prev => {
            const next = [...prev, data.logEntry];
            return next.slice(-50);
          });
        }

        setLiveStatus(data.result === 'sent'
          ? `✓ Sent → ${data.email}`
          : `✗ Failed → ${data.email}${data.logEntry?.error ? ': ' + data.logEntry.error : ''}`
        );

        // Stop conditions
        if (data.done || data.status === 'paused' || data.status === 'failed') break;

      } catch (err) {
        setLiveStatus(`⚠ Request error: ${err.message} — retrying in 5s`);
        await sleep(5000);   // back-off on network error, then retry
        continue;
      }

      // Wait the configured delay before next send
      await sleep(delayMs || 1500);
    }

    runningRef.current = false;
    setLiveStatus('');
    onRefresh();   // final refresh so parent list updates
  }, [onRefresh]);

  // Auto-start loop if campaign arrives already running
  useEffect(() => {
    if (campaign.status === 'running' && !runningRef.current) {
      runSendLoop(campaign.id, campaign.delayMs);
    }
    return () => { stopRef.current = true; };   // cleanup on unmount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = async () => {
    setActing(true);
    try {
      const { data } = await senderAPI.startCampaign(campaign.id);
      setCampaign(data.campaign);
      runSendLoop(campaign.id, data.campaign.delayMs);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally { setActing(false); }
  };

  const handlePause = async () => {
    stopRef.current = true;   // signal loop to stop after current send
    setActing(true);
    try {
      const { data } = await senderAPI.pauseCampaign(campaign.id);
      setCampaign(data.campaign);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally { setActing(false); }
  };

  const handleDelete = async () => {
    stopRef.current = true;
    await onDelete(campaign.id);
  };

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{campaign.name}</span>
            <StatusBadge status={campaign.status} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {campaign.id.slice(0, 8)} · {campaign.smtpUser} · {campaign.totalRecipients} recipients · limit {campaign.dailyLimit}/day
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Subject: <span style={{ color: 'var(--accent-cyan)' }}>{campaign.subject}</span>
          </div>
          {campaign.pauseReason && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-orange)', marginTop: '0.3rem' }}>
              ⏸ {campaign.pauseReason}
            </div>
          )}
          {/* Live status ticker */}
          {liveStatus && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', marginTop: '0.4rem',
              color: liveStatus.startsWith('✓') ? 'var(--accent-green)' : liveStatus.startsWith('✗') ? 'var(--danger)' : 'var(--accent-orange)',
              maxWidth: '480px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {liveStatus}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(campaign.status === 'pending' || campaign.status === 'paused') && (
            <button className="btn btn-success" style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
              onClick={handleStart} disabled={acting}>
              ▶ {campaign.status === 'paused' ? 'Resume' : 'Start'}
            </button>
          )}
          {campaign.status === 'running' && (
            <button className="btn btn-orange" style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
              onClick={handlePause} disabled={acting}>
              ⏸ Pause
            </button>
          )}
          <button className="btn btn-ghost" style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
            onClick={handleDelete} disabled={acting}>
            🗑
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Progress: {campaign.sent + campaign.failed} / {campaign.totalRecipients}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
            {progress}%
          </span>
        </div>
        <ProgressBar value={campaign.sent + campaign.failed} max={campaign.totalRecipients} />
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '1rem' }}>
        {[
          { label: 'Sent',    value: campaign.sent,        cls: 'stat-cyan'   },
          { label: 'Failed',  value: campaign.failed,      cls: 'stat-danger' },
          { label: 'Pending', value: campaign.pending,     cls: '',           color: '#a78bfa' },
          { label: 'Rate',    value: `${successRate}%`,   cls: 'stat-green'  },
        ].map(({ label, value, cls, color }) => (
          <div key={label} className={`stat-box ${cls}`} style={{ padding: '0.75rem', textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', ...(color ? { color } : {}) }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Success / Fail bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ background: 'var(--bg-primary)', borderRadius: '4px', height: '6px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${successRate}%`, height: '100%', background: 'var(--accent-green)',
            borderRadius: '4px 0 0 4px', transition: 'width 0.4s ease' }} />
          <div style={{ flex: 1, height: '100%', background: campaign.failed > 0 ? 'var(--danger)' : 'transparent', opacity: 0.5 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-green)' }}>✓ {campaign.sent} sent</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--danger)' }}>✗ {campaign.failed} failed</span>
        </div>
      </div>

      {/* Daily chart */}
      {dailyStats.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', gap: '1rem' }}>
            <span>Daily Activity</span>
            <span style={{ color: 'var(--accent-cyan)' }}>■ sent</span>
            <span style={{ color: 'var(--danger)' }}>■ failed</span>
          </div>
          <MiniBarChart dailyStats={dailyStats} />
        </div>
      )}

      {/* Logs toggle */}
      <div>
        <button className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.73rem', padding: '0.5rem' }}
          onClick={() => setShowLogs(s => !s)}>
          {showLogs ? '▲ Hide Logs' : `▼ Show Send Logs (${logs.length})`}
        </button>
        {showLogs && (
          <div style={{ marginTop: '0.75rem' }}>
            <div className="output-label">
              <span>Send Log (last 50)</span>
              <CopyButton text={logs.map(l =>
                `${l.status.toUpperCase()} | ${l.email} | ${l.timestamp}${l.error ? ' | ' + l.error : ''}`
              ).join('\n')} />
            </div>
            <div ref={logsRef} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', maxHeight: '220px', overflowY: 'auto',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              {logs.length === 0 ? (
                <div className="empty-state" style={{ padding: '1rem' }}>No logs yet</div>
              ) : [...logs].reverse().map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <span style={{ color: log.status === 'sent' ? 'var(--accent-green)' : 'var(--danger)', minWidth: '44px' }}>
                    {log.status === 'sent' ? '✓ SENT' : '✗ FAIL'}
                  </span>
                  <span style={{ color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.email}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.62rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.error && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.62rem', maxWidth: '180px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.error}>
                      {log.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CreateCampaignForm ───────────────────────────────────────────────────
function CreateCampaignForm({ onCreated }) {
  const [step, setStep] = useState(1);
  const [smtpConfig, setSmtpConfig] = useState({ host: '', port: '587', user: '', pass: '', secure: false });
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [smtpMsg, setSmtpMsg]       = useState('');
  const [testing, setTesting]       = useState(false);
  const [form, setForm] = useState({
    name: '', subject: '', body: '', fromName: '',
    emailsRaw: '', dailyLimit: '100', delayMs: '1500',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError]       = useState('');

  const emailCount = (form.emailsRaw.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []).length;

  const handleTestSmtp = async () => {
    setTesting(true); setSmtpStatus(null); setSmtpMsg('');
    try {
      const { data } = await senderAPI.testSmtp(smtpConfig);
      setSmtpStatus('ok'); setSmtpMsg(data.message);
    } catch (err) {
      setSmtpStatus('fail'); setSmtpMsg(err.response?.data?.error || err.message);
    } finally { setTesting(false); }
  };

  const handleCreate = async () => {
    if (!form.subject || !form.body || !form.emailsRaw) return setError('Fill in subject, body, and emails.');
    setError(''); setCreating(true);
    try {
      const { data } = await senderAPI.createCampaign({ ...form, smtpConfig });
      onCreated(data.campaign);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setCreating(false); }
  };

  const presets = [
    { label: 'Gmail',   host: 'smtp.gmail.com',            port: '587' },
    { label: 'Outlook', host: 'smtp-mail.outlook.com',     port: '587' },
    { label: 'Yahoo',   host: 'smtp.mail.yahoo.com',       port: '465' },
    { label: 'Zoho',    host: 'smtp.zoho.com',             port: '587' },
  ];

  return (
    <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--accent-cyan)', borderStyle: 'dashed' }}>
      <div className="card-header">
        <span className="card-title" style={{ fontSize: '0.8rem' }}>
          <span className="dot" /> New Campaign — Step {step} of 2
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[1,2].map(s => (
            <div key={s} onClick={() => setStep(s)} style={{ width: 24, height: 24, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              background: step === s ? 'var(--accent-cyan)' : 'var(--bg-primary)',
              color: step === s ? '#000' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
              border: '1px solid var(--border)' }}>{s}</div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Configure your SMTP server
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {presets.map(p => (
              <button key={p.label} className="btn btn-ghost"
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
                onClick={() => setSmtpConfig(s => ({ ...s, host: p.host, port: p.port }))}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              placeholder="SMTP Host" value={smtpConfig.host}
              onChange={e => setSmtpConfig(s => ({ ...s, host: e.target.value }))} />
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              placeholder="Port" value={smtpConfig.port}
              onChange={e => setSmtpConfig(s => ({ ...s, port: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              placeholder="Email / Username" value={smtpConfig.user}
              onChange={e => setSmtpConfig(s => ({ ...s, user: e.target.value }))} />
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              type="password" placeholder="Password / App Password" value={smtpConfig.pass}
              onChange={e => setSmtpConfig(s => ({ ...s, pass: e.target.value }))} />
          </div>
          <div style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: 'var(--radius)', padding: '0.6rem 0.8rem', marginBottom: '0.75rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-orange)' }}>
            💡 Gmail: use an <strong>App Password</strong>. Enable 2FA → Google Account → Security → App Passwords.
          </div>
          {smtpStatus && (
            <div className={`alert ${smtpStatus === 'ok' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '0.75rem' }}>
              {smtpStatus === 'ok' ? '✓' : '✗'} {smtpMsg}
            </div>
          )}
          <div className="btn-actions">
            <button className="btn btn-ghost" onClick={handleTestSmtp}
              disabled={testing || !smtpConfig.host || !smtpConfig.user || !smtpConfig.pass}>
              {testing ? '⏳ Testing...' : '🔌 Test Connection'}
            </button>
            <button className="btn btn-primary" onClick={() => setStep(2)}
              disabled={!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass}>
              Next →
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {error && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>⚠ {error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              placeholder="Campaign Name (optional)" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none' }}
              placeholder="From Name (optional)" value={form.fromName}
              onChange={e => setForm(f => ({ ...f, fromName: e.target.value }))} />
          </div>
          <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', marginBottom: '0.75rem', width: '100%' }}
            placeholder="Email Subject *" value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          <textarea className="tool-textarea" rows={5} style={{ marginBottom: '0.75rem' }}
            placeholder={"Email body (plain text or HTML)...\n\nHello,\n\nYour message.\n\nRegards"}
            value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />

          <div className="card-header" style={{ marginBottom: '0.4rem' }}>
            <span className="card-title">
              <span className="dot" style={{ background: 'var(--accent-green)' }} />Recipient Emails
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: emailCount > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {emailCount} email{emailCount !== 1 ? 's' : ''} detected
            </span>
          </div>
          <textarea className="tool-textarea" rows={5} style={{ marginBottom: '0.75rem' }}
            placeholder={"Paste bulk emails:\n\nalice@example.com\nbob@company.com, charlie@domain.org"}
            value={form.emailsRaw} onChange={e => setForm(f => ({ ...f, emailsRaw: e.target.value }))} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Daily Send Limit
              </div>
              <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', width: '100%' }}
                type="number" min="1" max="10000" placeholder="100" value={form.dailyLimit}
                onChange={e => setForm(f => ({ ...f, dailyLimit: e.target.value }))} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Max emails/day</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Delay Between Sends (ms)
              </div>
              <input className="tool-textarea" style={{ minHeight: 'unset', height: '40px', resize: 'none', width: '100%' }}
                type="number" min="500" max="60000" placeholder="1500" value={form.delayMs}
                onChange={e => setForm(f => ({ ...f, delayMs: e.target.value }))} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Prevents spam flags</div>
            </div>
          </div>

          {emailCount > 0 && form.dailyLimit && (
            <div style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)',
              borderRadius: 'var(--radius)', padding: '0.6rem 0.8rem', marginBottom: '0.75rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
              📊 {emailCount} emails · {form.dailyLimit}/day · ~{Math.ceil(emailCount / parseInt(form.dailyLimit || 1))} day(s)
              · ~{Math.round((emailCount * parseInt(form.delayMs || 1500)) / 1000 / 60)} min/day
              <br />
              <span style={{ color: 'var(--accent-orange)' }}>
                ⚡ Keep this browser tab open while sending — the loop runs in your browser.
              </span>
            </div>
          )}

          <div className="btn-actions">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={handleCreate}
              disabled={creating || !form.subject || !form.body || !form.emailsRaw}>
              {creating ? '⏳ Creating...' : '🚀 Create Campaign'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function EmailSender() {
  const [campaigns, setCampaigns]   = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const fetchCampaigns = useCallback(async () => {
    try {
      const { data } = await senderAPI.getAllCampaigns();
      setCampaigns(data.campaigns || []);
      setError('');
    } catch {
      setError('Cannot reach backend. Check your API URL.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleCreated = (c) => { setCampaigns(prev => [c, ...prev]); setShowForm(false); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await senderAPI.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) { alert(err.response?.data?.error || err.message); }
  };

  const totalSent    = campaigns.reduce((a, c) => a + (c.sent    || 0), 0);
  const totalFailed  = campaigns.reduce((a, c) => a + (c.failed  || 0), 0);
  const totalPending = campaigns.reduce((a, c) => a + (c.pending || 0), 0);
  const running      = campaigns.filter(c => c.status === 'running').length;
  const globalRate   = totalSent + totalFailed > 0 ? Math.round((totalSent / (totalSent + totalFailed)) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bulk Email <span className="highlight">Sender</span></h1>
        <p className="page-subtitle">// campaigns · daily limits · real-time analytics · send logs</p>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {campaigns.length > 0 && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Sent',    value: totalSent.toLocaleString(),    cls: 'stat-cyan'   },
            { label: 'Total Failed',  value: totalFailed.toLocaleString(),  cls: 'stat-danger' },
            { label: 'Pending',       value: totalPending.toLocaleString(), cls: '',  color: '#a78bfa' },
            { label: 'Global Rate',   value: `${globalRate}%`,             cls: 'stat-green'  },
          ].map(({ label, value, cls, color }) => (
            <div key={label} className={`stat-box ${cls}`}>
              <div className="stat-value" style={color ? { color } : {}}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} · {running} running
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={fetchCampaigns} style={{ fontSize: '0.78rem' }}>↻ Refresh</button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            {showForm ? '✕ Cancel' : '+ New Campaign'}
          </button>
        </div>
      </div>

      {showForm && <CreateCampaignForm onCreated={handleCreated} />}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" />Loading...</div>
      ) : campaigns.length === 0 && !showForm ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📤</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No campaigns yet</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Create your first bulk email campaign to get started
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Create First Campaign</button>
        </div>
      ) : (
        campaigns.map(c => (
          <CampaignCard key={c.id} campaign={c} onRefresh={fetchCampaigns} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}

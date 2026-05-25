import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../api';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (iso) => iso ? new Date(iso).toLocaleString() : '—';
const timeAgo = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color = 'var(--accent-cyan)', icon }) {
  return (
    <div className="stat-box" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{icon}</div>
      <div className="stat-value" style={{ color, fontSize: '1.8rem' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, currentUserId, onAction, onSelect }) {
  const isMe = user.id === currentUserId;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
      gap: '1rem', alignItems: 'center',
      padding: '0.85rem 1rem',
      borderBottom: '1px solid var(--border)',
      background: user.status === 'blocked' ? 'rgba(255,68,102,0.04)' : 'transparent',
      transition: 'background 0.15s',
    }}
    onMouseOver={e => e.currentTarget.style.background = user.status === 'blocked' ? 'rgba(255,68,102,0.07)' : 'rgba(255,255,255,0.02)'}
    onMouseOut={e  => e.currentTarget.style.background = user.status === 'blocked' ? 'rgba(255,68,102,0.04)' : 'transparent'}
    >
      {/* Identity */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem' }}>{user.email}</span>
          {isMe && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-cyan)',
            background: 'rgba(0,229,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '20px' }}>YOU</span>}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
            padding: '0.1rem 0.5rem', borderRadius: '20px',
            background: user.role === 'admin' ? 'rgba(124,58,237,0.15)' : 'rgba(136,136,170,0.1)',
            color: user.role === 'admin' ? '#a78bfa' : 'var(--text-muted)',
          }}>{user.role.toUpperCase()}</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
            padding: '0.1rem 0.5rem', borderRadius: '20px',
            background: user.status === 'blocked' ? 'rgba(255,68,102,0.15)' : 'rgba(0,255,136,0.1)',
            color: user.status === 'blocked' ? 'var(--danger)' : 'var(--accent-green)',
          }}>{user.status.toUpperCase()}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
          <span>Joined {timeAgo(user.createdAt)}</span>
          <span>Last login {timeAgo(user.lastLogin)}</span>
        </div>
      </div>

      {/* Activity */}
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{user.campaigns}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>campaigns</div>
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{user.totalSent?.toLocaleString() || 0}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>sent</div>
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <div style={{ color: 'var(--danger)', fontWeight: 700 }}>{user.totalFailed?.toLocaleString() || 0}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>failed</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.7rem' }}
          onClick={() => onSelect(user)}>
          👁 View
        </button>
        {!isMe && (
          <>
            <button className="btn btn-ghost"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.7rem',
                color: user.status === 'blocked' ? 'var(--accent-green)' : 'var(--accent-orange)',
                borderColor: user.status === 'blocked' ? 'var(--accent-green)' : 'var(--accent-orange)' }}
              onClick={() => onAction('block', user)}>
              {user.status === 'blocked' ? '✓ Unblock' : '⊘ Block'}
            </button>
            <button className="btn btn-ghost"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.7rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={() => onAction('delete', user)}>
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── User Detail Drawer ───────────────────────────────────────────────────────
function UserDetailDrawer({ userId, onClose, onAction }) {
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ email: '', role: 'user', newPassword: '' });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    adminAPI.getUserDetail(userId)
      .then(({ data }) => { setDetail(data); setForm({ email: data.user.email, role: data.user.role, newPassword: '' }); })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    const payload = { email: form.email, role: form.role };
    if (form.newPassword) payload.newPassword = form.newPassword;
    try {
      await adminAPI.updateUser(userId, payload);
      setMsg('✓ Saved');
      setEditMode(false);
      const { data } = await adminAPI.getUserDetail(userId);
      setDetail(data);
    } catch (err) {
      setMsg('✗ ' + (err.response?.data?.error || err.message));
    } finally { setSaving(false); }
  };

  const statusColor = { pending: '#8888aa', running: 'var(--accent-cyan)', paused: 'var(--accent-orange)', completed: 'var(--accent-green)', failed: 'var(--danger)' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      {/* Backdrop */}
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      {/* Panel */}
      <div style={{ width: '480px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
        overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>User Detail</span>
          <button className="btn btn-ghost" style={{ padding: '0.3rem 0.7rem' }} onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : detail && (
          <>
            {/* User Info / Edit */}
            <div className="card">
              <div className="card-header">
                <span className="card-title"><span className="dot" />Account</span>
                <button className="btn btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
                  onClick={() => setEditMode(e => !e)}>
                  {editMode ? 'Cancel' : '✏ Edit'}
                </button>
              </div>
              {msg && <div className={`alert ${msg.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '0.5rem' }}>{msg}</div>}
              {editMode ? (
                <>
                  {[
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'New Password (leave blank to keep)', key: 'newPassword', type: 'password' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>{f.label}</div>
                      <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                          borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Role</div>
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                      style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Save Changes'}
                  </button>
                </>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {[
                    ['Email',      detail.user.email],
                    ['Role',       detail.user.role],
                    ['Status',     detail.user.status],
                    ['Joined',     fmt(detail.user.createdAt)],
                    ['Last Login', fmt(detail.user.lastLogin)],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="card" style={{ borderColor: 'rgba(255,68,102,0.3)' }}>
              <div className="card-title" style={{ marginBottom: '0.75rem' }}>
                <span className="dot" style={{ background: 'var(--danger)' }} />Danger Zone
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost"
                  style={{ flex: 1, color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)', fontSize: '0.78rem' }}
                  onClick={() => { onAction('block', detail.user); onClose(); }}>
                  {detail.user.status === 'blocked' ? '✓ Unblock User' : '⊘ Block User'}
                </button>
                <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.78rem' }}
                  onClick={() => { onAction('delete', detail.user); onClose(); }}>
                  🗑 Delete User + Data
                </button>
              </div>
            </div>

            {/* Campaigns */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: '0.75rem' }}>
                <span className="dot" />Campaigns ({detail.campaigns.length})
              </div>
              {detail.campaigns.length === 0 ? (
                <div className="empty-state">No campaigns yet</div>
              ) : detail.campaigns.map((c, i) => (
                <div key={i} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem' }}>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                      color: statusColor[c.status] || 'var(--text-muted)' }}>{c.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {c.subject} · {c.totalRecipients} recipients · {c.sent} sent · {c.failed} failed
                    {c.successRate > 0 ? ` · ${c.successRate}% success` : ''}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Created {fmt(c.createdAt)}
                    {c.completedAt && ` · Completed ${fmt(c.completedAt)}`}
                  </div>
                  <div style={{ marginTop: '0.4rem' }}>
                    <button className="btn btn-ghost"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      onClick={() => adminAPI.deleteCampaign(c.id).then(() => {
                        setDetail(d => ({ ...d, campaigns: d.campaigns.filter(x => x.id !== c.id) }));
                      })}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin data.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (action, user) => {
    const confirm_msg = action === 'delete'
      ? `Delete ${user.email} and ALL their campaigns? This cannot be undone.`
      : `${user.status === 'blocked' ? 'Unblock' : 'Block'} ${user.email}?`;
    if (!window.confirm(confirm_msg)) return;
    try {
      if (action === 'delete') {
        await adminAPI.deleteUser(user.id);
        setActionMsg(`✓ ${user.email} deleted.`);
      } else {
        const { data } = await adminAPI.toggleBlock(user.id);
        setActionMsg(`✓ ${user.email} ${data.status}.`);
      }
      await load();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setActionMsg('✗ ' + (err.response?.data?.error || err.message));
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole   === 'all' || u.role   === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Admin <span className="highlight">Panel</span></h1>
        <p className="page-subtitle">// full control over users, campaigns &amp; platform activity</p>
      </div>

      {error    && <div className="alert alert-error"   style={{ marginBottom: '1rem' }}>⚠ {error}</div>}
      {actionMsg && <div className={`alert ${actionMsg.startsWith('✓') ? 'alert-success' : 'alert-error'}`}
        style={{ marginBottom: '1rem' }}>{actionMsg}</div>}

      {/* Platform Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard icon="👥" label="Total Users"      value={stats.totalUsers}      color="var(--accent-cyan)" />
          <StatCard icon="🚫" label="Blocked"          value={stats.blockedUsers}    color="var(--danger)" />
          <StatCard icon="📤" label="Total Campaigns"  value={stats.totalCampaigns}  color="#a78bfa" />
          <StatCard icon="✉️" label="Emails Sent"      value={stats.totalSent?.toLocaleString() || 0} color="var(--accent-green)" />
        </div>
      )}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard icon="🆕" label="New (7d)"         value={stats.recentUsers}     color="var(--accent-cyan)" />
          <StatCard icon="▶" label="Active Campaigns"  value={stats.activeCampaigns} color="var(--accent-orange)" />
          <StatCard icon="✗" label="Total Failed"      value={stats.totalFailed?.toLocaleString() || 0} color="var(--danger)" />
          <StatCard icon="📊" label="Success Rate"     value={`${stats.successRate}%`} color="var(--accent-green)" />
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <span className="card-title"><span className="dot" />Users ({filtered.length})</span>
          <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} onClick={load}>
            ↻ Refresh
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            style={{ flex: 1, minWidth: '200px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem', padding: '0.5rem 0.75rem', outline: 'none' }}
            placeholder="Search by email..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {[
            { label: 'Role', value: filterRole, set: setFilterRole, options: ['all','user','admin'] },
            { label: 'Status', value: filterStatus, set: setFilterStatus, options: ['all','active','blocked'] },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px',
                color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                padding: '0.5rem 0.75rem', outline: 'none' }}>
              {f.options.map(o => <option key={o} value={o}>{o === 'all' ? `All ${f.label}s` : o}</option>)}
            </select>
          ))}
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
          gap: '1rem', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          <span>User</span>
          <span style={{ textAlign: 'center' }}>Campaigns</span>
          <span style={{ textAlign: 'center' }}>Sent</span>
          <span style={{ textAlign: 'center' }}>Failed</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="spinner-wrap" style={{ padding: '2rem' }}><div className="spinner" />Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-icon">👥</div>No users match your filters
          </div>
        ) : filtered.map(u => (
          <UserRow key={u.id} user={u} currentUserId={currentUser?.id}
            onAction={handleAction} onSelect={setSelectedUser} />
        ))}
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <UserDetailDrawer
          userId={selectedUser.id}
          onClose={() => setSelectedUser(null)}
          onAction={(action, user) => { setSelectedUser(null); handleAction(action, user); }}
        />
      )}
    </div>
  );
}

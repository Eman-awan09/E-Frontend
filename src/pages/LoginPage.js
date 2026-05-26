// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { authAPI } from '../api';

// export default function LoginPage() {
//   const { login, register } = useAuth();

//   const [mode, setMode]         = useState('login'); // 'login' | 'register' | 'change'
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [newPass, setNewPass]   = useState('');
//   const [setupKey, setSetupKey] = useState('');
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState('');
//   const [success, setSuccess]   = useState('');
//   const [showPass, setShowPass] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setSuccess('');
//     setLoading(true);
//     try {
//       if (mode === 'login') {
//         await login(email, password);
//         // AuthContext sets user → App re-renders to main UI
//       } else if (mode === 'register') {
//         await register(email, password, setupKey);
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setError(''); setSuccess('');
//     setLoading(true);
//     try {
//       const { data } = await authAPI.changePassword(password, newPass);
//       setSuccess(data.message);
//       setPassword(''); setNewPass('');
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh', background: 'var(--bg-primary)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       padding: '1.5rem',
//     }}>
//       {/* Background grid decoration */}
//       <div style={{
//         position: 'fixed', inset: 0, zIndex: 0,
//         backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
//         backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none',
//       }} />

//       <div style={{
//         position: 'relative', zIndex: 1,
//         width: '100%', maxWidth: '420px',
//         background: 'var(--bg-card)', border: '1px solid var(--border)',
//         borderRadius: '16px', padding: '2.5rem',
//         boxShadow: '0 0 60px rgba(0,229,255,0.06)',
//       }}>
//         {/* Logo */}
//         <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//           <div style={{
//             width: 52, height: 52, margin: '0 auto 1rem',
//             background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
//             borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '1.6rem',
//           }}>📧</div>
//           <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
//             Email<span style={{ color: 'var(--accent-cyan)' }}>Tools</span> Pro
//           </div>
//           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
//             {mode === 'login'    ? '// sign in to continue'
//            : mode === 'register' ? '// create your account'
//            :                       '// update your password'}
//           </div>
//         </div>

//         {/* Mode tabs */}
//         <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem',
//           background: 'var(--bg-primary)', borderRadius: '8px', padding: '3px' }}>
//           {[
//             { id: 'login',    label: 'Sign In'  },
//             { id: 'register', label: 'Register' },
//           ].map(tab => (
//             <button key={tab.id} onClick={() => { setMode(tab.id); setError(''); setSuccess(''); }}
//               style={{
//                 flex: 1, padding: '0.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
//                 fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700,
//                 background: mode === tab.id ? 'var(--bg-card)' : 'transparent',
//                 color:      mode === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
//                 transition: 'all 0.15s ease',
//               }}>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Alerts */}
//         {error   && <div className="alert alert-error"   style={{ marginBottom: '1rem' }}>⚠ {error}</div>}
//         {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✓ {success}</div>}

//         {/* Login / Register Form */}
//         {(mode === 'login' || mode === 'register') && (
//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div style={{ marginBottom: '0.75rem' }}>
//               <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
//                 textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
//                 display: 'block', marginBottom: '0.4rem' }}>
//                 Email Address
//               </label>
//               <input
//                 type="email" required value={email} onChange={e => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 style={{
//                   width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
//                   borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
//                   fontSize: '0.85rem', padding: '0.65rem 0.9rem', outline: 'none',
//                   transition: 'border-color 0.2s',
//                 }}
//                 onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
//                 onBlur={e  => e.target.style.borderColor = 'var(--border)'}
//               />
//             </div>

//             {/* Password */}
//             <div style={{ marginBottom: mode === 'register' ? '0.75rem' : '1.25rem' }}>
//               <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
//                 textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
//                 display: 'block', marginBottom: '0.4rem' }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type={showPass ? 'text' : 'password'} required value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   placeholder={mode === 'register' ? 'Min. 8 characters' : 'Your password'}
//                   style={{
//                     width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
//                     borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
//                     fontSize: '0.85rem', padding: '0.65rem 2.5rem 0.65rem 0.9rem', outline: 'none',
//                     transition: 'border-color 0.2s', boxSizing: 'border-box',
//                   }}
//                   onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
//                   onBlur={e  => e.target.style.borderColor = 'var(--border)'}
//                 />
//                 <button type="button" onClick={() => setShowPass(s => !s)}
//                   style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)',
//                     background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
//                     color: 'var(--text-muted)', padding: 0 }}>
//                   {showPass ? '🙈' : '👁'}
//                 </button>
//               </div>
//             </div>

//             {/* Setup Key (register only) */}
//             {mode === 'register' && (
//               <div style={{ marginBottom: '1.25rem' }}>
//                 <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
//                   textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
//                   display: 'block', marginBottom: '0.4rem' }}>
//                   Setup Key
//                 </label>
//                 <input
//                   type="password" required value={setupKey} onChange={e => setSetupKey(e.target.value)}
//                   placeholder="Admin setup key"
//                   style={{
//                     width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
//                     borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
//                     fontSize: '0.85rem', padding: '0.65rem 0.9rem', outline: 'none',
//                     transition: 'border-color 0.2s',
//                   }}
//                   onFocus={e => e.target.style.borderColor = 'var(--accent-cyan)'}
//                   onBlur={e  => e.target.style.borderColor = 'var(--border)'}
//                 />
//                 <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
//                   Set SETUP_KEY in your Vercel environment variables
//                 </div>
//               </div>
//             )}

//             <button type="submit" disabled={loading}
//               style={{
//                 width: '100%', padding: '0.75rem',
//                 background: 'linear-gradient(135deg, var(--accent-cyan), #0080ff)',
//                 border: 'none', borderRadius: '8px', color: '#000',
//                 fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800,
//                 cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
//                 letterSpacing: '0.05em', textTransform: 'uppercase',
//                 transition: 'all 0.2s ease',
//               }}
//               onMouseOver={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
//               onMouseOut={e  => { e.target.style.transform = 'translateY(0)'; }}
//             >
//               {loading
//                 ? (mode === 'login' ? '⏳ Signing in...' : '⏳ Creating account...')
//                 : (mode === 'login' ? '→ Sign In'         : '→ Create Account')}
//             </button>
//           </form>
//         )}

//         {/* Footer */}
//         <div style={{ marginTop: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)',
//           fontSize: '0.65rem', color: 'var(--text-muted)' }}>
//           EmailTools Pro · Private Access Only
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

const fieldStyle = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '1rem',       /* ≥16px — prevents iOS auto-zoom */
  padding: '0.7rem 0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  minHeight: 'var(--touch-min)',
  boxSizing: 'border-box',
};

function Field({ label, type = 'text', value, onChange, placeholder, hint, children }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
        display: 'block', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} required
          style={fieldStyle}
          className="login-input"
          onFocus={e => { e.target.style.borderColor = 'var(--accent-cyan)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.08)'; }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
        {children}
      </div>
      {hint && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'var(--text-muted)', marginTop: '0.3rem' }}>{hint}</div>}
    </div>
  );
}

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [newPass, setNewPass]   = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showPass, setShowPass] = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login')    await login(email, password);
      if (mode === 'register') await register(email, password, setupKey);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { data } = await authAPI.changePassword(password, newPass);
      setSuccess(data.message);
      setPassword(''); setNewPass('');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      {/* Background grid */}
      <div className="login-bg-grid" aria-hidden="true" />

      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 48, height: 48, margin: '0 auto 0.85rem',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem' }}>📧</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', letterSpacing: '-0.02em' }}>
            Email<span style={{ color: 'var(--accent-cyan)' }}>Tools</span> Pro
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {mode === 'login'    ? '// sign in to continue'
           : mode === 'register' ? '// create your account'
           :                       '// update your password'}
          </div>
        </div>

        {/* Mode tabs */}
        <div className="login-tabs">
          {[
            { id: 'login',    label: 'Sign In'  },
            { id: 'register', label: 'Register' },
          ].map(t => (
            <button key={t.id} type="button"
              className={`login-tab ${mode === t.id ? 'active' : ''}`}
              onClick={() => switchMode(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error   && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        {/* Login / Register form */}
        {(mode === 'login' || mode === 'register') && (
          <form onSubmit={handleSubmit} noValidate>
            <Field label="Email Address" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" />

            <Field label="Password"
              type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Min. 8 characters' : 'Your password'}>
              {/* Toggle visibility button */}
              <button type="button" onClick={() => setShowPass(s => !s)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)',
                  padding: '0.25rem', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </Field>

            {mode === 'register' && (
              <Field label="Setup Key" type="password"
                value={setupKey} onChange={e => setSetupKey(e.target.value)}
                placeholder="Admin setup key from Vercel env vars"
                hint="Set SETUP_KEY in your Vercel backend environment variables" />
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.8rem',
              marginTop: '0.25rem',
              background: 'linear-gradient(135deg, var(--accent-cyan), #0080ff)',
              border: 'none', borderRadius: '8px', color: '#000',
              fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              minHeight: 'var(--touch-min)', transition: 'opacity 0.2s',
            }}>
              {loading
                ? (mode === 'login' ? '⏳ Signing in...' : '⏳ Creating account...')
                : (mode === 'login' ? '→ Sign In'         : '→ Create Account')}
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.25rem', textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          EmailTools Pro · Private Access Only
        </div>
      </div>
    </div>
  );
}

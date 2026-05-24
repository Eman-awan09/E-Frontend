// import { useState } from 'react';
// import './styles/global.css';
// import RemoveDuplicates from './pages/RemoveDuplicates';
// import UrlCleaner from './pages/UrlCleaner';
// import ExtractEmails from './pages/ExtractEmails';
// import ShuffleEmails from './pages/ShuffleEmails';
// import EmailSender from './pages/EmailSender';

// const TABS = [
//   { id: 'dedup',    label: 'Remove Duplicates', icon: '🧹', num: '01' },
//   { id: 'urlclean', label: 'URL Cleaner',        icon: '🔗', num: '02' },
//   { id: 'extract',  label: 'Extract Emails',     icon: '🔎', num: '03' },
//   { id: 'shuffle',  label: 'Shuffle Emails',     icon: '🔀', num: '04' },
//   { id: 'sender',   label: 'Bulk Sender',        icon: '📤', num: '05' },
// ];

// function App() {
//   const [activeTab, setActiveTab] = useState('dedup');

//   const renderPage = () => {
//     switch (activeTab) {
//       case 'dedup':    return <RemoveDuplicates />;
//       case 'urlclean': return <UrlCleaner />;
//       case 'extract':  return <ExtractEmails />;
//       case 'shuffle':  return <ShuffleEmails />;
//       case 'sender':   return <EmailSender />;
//       default:         return <RemoveDuplicates />;
//     }
//   };

//   return (
//     <div className="app-wrapper">
//       {/* Header */}
//       <header className="app-header">
//         <div className="header-logo">
//           <div className="logo-icon">📧</div>
//           <div className="logo-text">Email<span>Tools</span> Pro</div>
//         </div>
//         <div className="header-badge">v2.0.0 · MERN Stack</div>
//       </header>

//       {/* Navigation */}
//       <nav className="nav-container">
//         <div className="nav-tabs">
//           {TABS.map(tab => (
//             <button
//               key={tab.id}
//               className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               <span className="tab-num">{tab.num}</span>
//               <span>{tab.icon}</span>
//               <span>{tab.label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Page Content */}
//       <main className="main-content">
//         {renderPage()}
//       </main>

//       {/* Footer */}
//       <footer className="app-footer">
//         EmailTools Pro · Built with MERN Stack · All operations run on your server
//       </footer>
//     </div>
//   );
// }

// export default App;

import { useState } from 'react';
import './styles/global.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage       from './pages/LoginPage';
import RemoveDuplicates from './pages/RemoveDuplicates';
import UrlCleaner      from './pages/UrlCleaner';
import ExtractEmails   from './pages/ExtractEmails';
import ShuffleEmails   from './pages/ShuffleEmails';
import EmailSender     from './pages/EmailSender';

const TABS = [
  { id: 'dedup',    label: 'Remove Duplicates', icon: '🧹', num: '01' },
  { id: 'urlclean', label: 'URL Cleaner',        icon: '🔗', num: '02' },
  { id: 'extract',  label: 'Extract Emails',     icon: '🔎', num: '03' },
  { id: 'shuffle',  label: 'Shuffle Emails',     icon: '🔀', num: '04' },
  { id: 'sender',   label: 'Bulk Sender',         icon: '📤', num: '05' },
];

function MainApp() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dedup');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // While verifying token show splash
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-wrap">
          <div className="spinner" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  // Not logged in → show login
  if (!user) return <LoginPage />;

  const renderPage = () => {
    switch (activeTab) {
      case 'dedup':    return <RemoveDuplicates />;
      case 'urlclean': return <UrlCleaner />;
      case 'extract':  return <ExtractEmails />;
      case 'shuffle':  return <ShuffleEmails />;
      case 'sender':   return <EmailSender />;
      default:         return <RemoveDuplicates />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo">
          <div className="logo-icon">📧</div>
          <div className="logo-text">Email<span>Tools</span> Pro</div>
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(s => !s)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
            onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ color: 'var(--accent-cyan)' }}>●</span>
            {user.email}
            <span style={{ color: 'var(--text-muted)' }}>▾</span>
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={() => setShowUserMenu(false)} />
              {/* Dropdown */}
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', minWidth: '200px', overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Signed in as<br />
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>{user.email}</span>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); logout(); }}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', background: 'none', border: 'none',
                    color: 'var(--danger)', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.target.style.background = 'rgba(255,68,102,0.08)'}
                  onMouseOut={e  => e.target.style.background = 'none'}
                >
                  ⎋ Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-tabs">
          {TABS.map(tab => (
            <button key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              <span className="tab-num">{tab.num}</span>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Page */}
      <main className="main-content">{renderPage()}</main>

      <footer className="app-footer">
        EmailTools Pro · Private · {user.email}
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

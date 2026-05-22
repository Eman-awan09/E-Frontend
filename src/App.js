import { useState } from 'react';
import './styles/global.css';
import RemoveDuplicates from './pages/RemoveDuplicates';
import UrlCleaner from './pages/UrlCleaner';
import ExtractEmails from './pages/ExtractEmails';
import ShuffleEmails from './pages/ShuffleEmails';
import EmailSender from './pages/EmailSender';

const TABS = [
  { id: 'dedup',    label: 'Remove Duplicates', icon: '🧹', num: '01' },
  { id: 'urlclean', label: 'URL Cleaner',        icon: '🔗', num: '02' },
  { id: 'extract',  label: 'Extract Emails',     icon: '🔎', num: '03' },
  { id: 'shuffle',  label: 'Shuffle Emails',     icon: '🔀', num: '04' },
  { id: 'sender',   label: 'Bulk Sender',        icon: '📤', num: '05' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dedup');

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
        <div className="header-badge">v2.0.0 · MERN Stack</div>
      </header>

      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-num">{tab.num}</span>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        EmailTools Pro · Built with MERN Stack · All operations run on your server
      </footer>
    </div>
  );
}

export default App;

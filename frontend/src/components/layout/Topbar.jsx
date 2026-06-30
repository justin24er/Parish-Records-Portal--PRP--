
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, ChevronDown, User, Settings, LogOut } from 'lucide-react';

import { useSidebar }   from '../../contexts/SidebarContext';
import { useAuth }      from '../../contexts/AuthContext';
import { useClock }     from '../../hooks/useClock';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import Avatar           from '../ui/Avatar';
import { ROUTES }       from '../../constants/routes';
import toast            from 'react-hot-toast';

export default function Topbar() {
  const { collapsed, toggleMobile } = useSidebar();
  const { user, logout }            = useAuth();
  const { date, time }              = useClock();
  const navigate                    = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));

  async function handleLogout() {
    setDropdownOpen(false);
    const tid = toast.loading('Inatoka...');
    try {
      await logout();
      toast.dismiss(tid);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      toast.dismiss(tid);
      toast.error('Hitilafu wakati wa kutoka.');
    }
  }

  return (
    <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Left: Mobile toggle + Search */}
      <div className="topbar-left">
        <button
          className="topbar-mobile-toggle btn btn-icon btn-ghost"
          onClick={toggleMobile}
          aria-label="Fungua menyu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-search">
          <Search className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Tafuta waumini, vyeti... (Search)"
            aria-label="Tafuta"
          />
        </div>
      </div>

      {/* Right: Date/Time, Notifications, Profile */}
      <div className="topbar-right">
        {/* Date & Time */}
        <div className="topbar-datetime">
          <span className="topbar-date">{date}</span>
          <span className="topbar-time">{time}</span>
        </div>

        {/* Dark mode placeholder */}
        <button
          className="topbar-icon-btn"
          title="Hali ya giza (haitumiki bado)"
          disabled
          style={{ opacity: 0.4 }}
        >
          <Sun size={18} />
        </button>

        {/* Notifications */}
        <button className="topbar-icon-btn" title="Arifa (Notifications)">
          <Bell size={18} />
          <span className="topbar-badge" />
        </button>

        {/* Profile dropdown */}
        <div className="dropdown-wrapper" ref={dropdownRef}>
          <button
            className="topbar-profile"
            onClick={() => setDropdownOpen(p => !p)}
            aria-label="Akaunti"
            aria-expanded={dropdownOpen}
          >
            <Avatar name={user?.jina || user?.name || 'Mtumiaji'} size="md" />
            <div className="topbar-profile-info">
              <div className="topbar-profile-name">
                {user?.jina || user?.name || 'Mtumiaji'}
              </div>
              <div className="topbar-profile-role">
                {user?.role === 'admin' ? 'Msimamizi' : 'Katibu wa Parokia'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              {/* User info header */}
              <div style={{ padding: 'var(--space-3) var(--space-3)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-1)' }}>
                <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  {user?.jina || user?.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {user?.email}
                </div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => { navigate(ROUTES.WASIFU); setDropdownOpen(false); }}
              >
                <User size={16} /> Wasifu Wangu
              </button>

              <button
                className="dropdown-item"
                onClick={() => { navigate(ROUTES.MIPANGILIO); setDropdownOpen(false); }}
              >
                <Settings size={16} /> Mipangilio
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} /> Ondoka
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
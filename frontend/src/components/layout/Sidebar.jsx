// frontend/src/components/layout/Sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Droplets, FileText, BookOpen,
  BarChart2, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';

import { useSidebar }  from '../../contexts/SidebarContext';
import { useAuth }     from '../../contexts/AuthContext';
import { NAV_ITEMS }   from '../../constants/routes';
import { APP_ABBR, APP_NAME, PARISH_NAME } from '../../constants/app';
import toast from 'react-hot-toast';

// Icon map for nav items
const ICON_MAP = {
  LayoutDashboard,
  Users,
  Droplets,
  FileText,
  BookOpen,
  BarChart2,
  Bell,
  Settings,
  LogOut,
};

export default function Sidebar() {
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebar();
  const { logout } = useAuth();
  const navigate   = useNavigate();

  async function handleLogout() {
    const tid = toast.loading('Inatoka...');
    try {
      await logout();
      toast.dismiss(tid);
      navigate('/ingia', { replace: true });
    } catch {
      toast.dismiss(tid);
      toast.error('Hitilafu wakati wa kutoka.');
    }
  }

  // Group nav items by section
  const sections = NAV_ITEMS.reduce((acc, item) => {
    const key = item.section || '__root__';
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobile} />
      )}

      <nav className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <NavLink to="/dashibodi" className="sidebar-brand" onClick={closeMobile}>
          <div className="sidebar-brand-logo">
            <img src="/PRP_logo.png" alt="PRP" />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">{APP_ABBR}</div>
            <div className="sidebar-brand-subtitle">{PARISH_NAME}</div>
          </div>
        </NavLink>

        {/* Navigation */}
        <div className="sidebar-nav">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              {section !== '__root__' && (
                <div className="sidebar-section-label">{section}</div>
              )}
              {items.map((item) => {
                const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? 'active' : ''}`
                    }
                    onClick={closeMobile}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="sidebar-item-icon" size={20} strokeWidth={1.75} />
                    <span className="sidebar-item-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-item"
            onClick={handleLogout}
            title={collapsed ? 'Ondoka' : undefined}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut className="sidebar-item-icon" size={20} strokeWidth={1.75} />
            <span className="sidebar-item-label">Ondoka</span>
          </button>

          {/* Collapse toggle — desktop only */}
          <button className="sidebar-collapse-btn" onClick={toggleCollapsed}>
            {collapsed
              ? <ChevronRight size={18} />
              : <ChevronLeft size={18} />
            }
          </button>
        </div>
      </nav>
    </>
  );
}

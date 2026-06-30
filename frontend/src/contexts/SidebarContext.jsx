// frontend/src/contexts/SidebarContext.jsx
// Manages sidebar open/collapsed state across the app.

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/app';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed,   setCollapsed]   = useState(
    () => localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'true'
  );
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(collapsed));
  }, [collapsed]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleCollapsed  = () => setCollapsed(p => !p);
  const toggleMobile     = () => setMobileOpen(p => !p);
  const closeMobile      = ()  => setMobileOpen(false);

  return (
    <SidebarContext.Provider value={{
      collapsed,
      mobileOpen,
      toggleCollapsed,
      toggleMobile,
      closeMobile,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

export default SidebarContext;

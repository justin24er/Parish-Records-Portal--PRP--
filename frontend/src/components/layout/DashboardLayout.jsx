// frontend/src/components/layout/DashboardLayout.jsx
// Wraps all authenticated pages with sidebar + topbar.

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSidebar } from '../../contexts/SidebarContext';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

export default function DashboardLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="app-shell">
      <Sidebar />

      <div className={`main-area ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar />

        <main className="page-content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

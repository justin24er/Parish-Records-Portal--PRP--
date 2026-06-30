// frontend/src/pages/PlaceholderPage.jsx
// Shown for modules not yet implemented. Replaced module-by-module in future milestones.

import { motion }   from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Droplets, FileText, BookOpen,
  BarChart2, Bell, Settings, UserCircle, Wrench,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';

const ICON_MAP = {
  Users, Droplets, FileText, BookOpen,
  BarChart2, Bell, Settings, UserCircle, Wrench,
};

export default function PlaceholderPage({ title = 'Ukurasa', icon = 'Wrench' }) {
  const navigate = useNavigate();
  const Icon     = ICON_MAP[icon] || Wrench;

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{ duration: 0.35 }}
    >
      {/* Icon */}
      <div style={{
        width: 88, height: 88,
        background: 'var(--color-primary-pale)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--space-5)',
        border: '2px dashed var(--color-primary)',
        opacity: 0.85,
      }}>
        <Icon size={36} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
      </div>

      {/* Title */}
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h2>

      {/* Subtitle */}
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 420, lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
        Sehemu hii ipo katika ujenzi na itapatikana hivi karibuni.{' '}
        <span style={{ color: 'var(--color-text-secondary)' }}>
          (This module is under construction and will be available in the next milestone.)
        </span>
      </p>

      {/* Badge */}
      <span className="badge badge-warning" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-6)' }}>
        🔧 &nbsp; Inajengwa — Coming Soon
      </span>

      {/* Back button */}
      <button
        className="btn btn-primary"
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        Rudi Dashibodini
      </button>
    </motion.div>
  );
}

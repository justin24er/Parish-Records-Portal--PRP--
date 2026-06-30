
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * items: Array<{ label: string, path?: string }>
 * Last item is always considered "active" (no link).
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {idx > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
            {isLast || !item.path ? (
              <span className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                {item.label}
              </span>
            ) : (
              <Link className="breadcrumb-item" to={item.path}>
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
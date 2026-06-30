
import { Loader2 } from 'lucide-react';

export default function Loader({ size = 24, text = 'Inapakia...', fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)', zIndex: 9998,
        gap: 'var(--space-3)',
      }}>
        <Loader2
          size={40}
          strokeWidth={1.5}
          style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }}
        />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 'var(--space-2)',
      padding: 'var(--space-6)',
    }}>
      <Loader2
        size={size}
        strokeWidth={2}
        style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }}
      />
      {text && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {text}
        </span>
      )}
    </div>
  );
}
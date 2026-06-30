// frontend/src/components/ui/SkeletonLoader.jsx

export function SkeletonLine({ width = '100%', height = 14, mb = 8 }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 'var(--radius-sm)', marginBottom: mb }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ animation: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="60%" height={16} />
          <SkeletonLine width="40%" height={12} mb={0} />
        </div>
      </div>
      <SkeletonLine width="100%" />
      <SkeletonLine width="85%"  />
      <SkeletonLine width="70%"  mb={0} />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card" style={{ animation: 'none' }}>
      <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <SkeletonLine width="60%" height={12} />
        <SkeletonLine width="40%" height={28} mb={0} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {[1,2,3,4].map(i => (
              <th key={i}><SkeletonLine width="70%" height={12} mb={0} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1,2,3,4].map(j => (
                <td key={j}><SkeletonLine width={j === 1 ? '80%' : '60%'} height={12} mb={0} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

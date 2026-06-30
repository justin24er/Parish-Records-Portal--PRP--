
export default function Badge({ variant = 'primary', children, dot = false }) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && (
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
import { getInitials } from '../../utils/helpers';

const SIZE_MAP = {
  sm:  { width: 28, height: 28, fontSize: '11px' },
  md:  { width: 36, height: 36, fontSize: '13px' },
  lg:  { width: 48, height: 48, fontSize: '16px' },
  xl:  { width: 64, height: 64, fontSize: '20px' },
};

export default function Avatar({ name = '', src, size = 'md' }) {
  const dim = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(name);

  const style = {
    width:            dim.width,
    height:           dim.height,
    borderRadius:     '50%',
    flexShrink:       0,
    display:          'flex',
    alignItems:       'center',
    justifyContent:   'center',
    fontSize:         dim.fontSize,
    fontWeight:       'var(--weight-semibold)',
    background:       'var(--color-primary)',
    color:            'white',
    overflow:         'hidden',
  };

  if (src) {
    return (
      <div style={style}>
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  return <div style={style}>{initials || '?'}</div>;
}
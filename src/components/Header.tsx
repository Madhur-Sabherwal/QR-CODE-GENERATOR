export default function Header() {
  return (
    <div className="text-center mb-8">
      <p
        className="text-xs tracking-widest uppercase mb-3"
        style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.25)' }}
      >
        QR Studio — v1.0
      </p>
      <a
        href="https://buymeacoffee.com/MaadhurSabherwal"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'rgba(255,214,0,0.1)'
          el.style.borderColor = 'rgba(255,214,0,0.35)'
          el.style.color = 'rgba(255,214,0,0.85)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = 'rgba(255,255,255,0.05)'
          el.style.borderColor = 'rgba(255,255,255,0.12)'
          el.style.color = 'rgba(255,255,255,0.45)'
        }}
      >
        <span style={{ fontSize: '14px' }}>☕</span>
        built by Maadhur · buy me a coffee
      </a>
    </div>
  )
}

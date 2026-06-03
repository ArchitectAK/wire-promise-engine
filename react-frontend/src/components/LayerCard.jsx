function MetricBox({ label, value, sub, highlight }) {
  return (
    <div style={{
      background: '#0f172a',
      borderRadius: '8px',
      padding: '10px 16px',
      minWidth: '150px',
      border: highlight ? '1px solid #3b82f6' : 'none',
    }}>
      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: highlight ? '#60a5fa' : '#f8fafc', marginTop: '2px' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: highlight ? '#93c5fd' : '#94a3b8', marginTop: '2px', fontWeight: highlight ? 700 : 400 }}>{sub}</div>}
    </div>
  )
}

export default function LayerCard({ number, color, icon, title, model, metrics, footer }) {
  return (
    <div style={{
      background: '#1e2533',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '16px',
      borderLeft: `5px solid ${color}`,
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>
        LAYER {number}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px' }}>
        {icon} {title}{' '}
        <span style={{ fontWeight: 400, fontSize: '0.78rem', color: '#64748b' }}>({model})</span>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {metrics.map((m, i) => (
          <MetricBox key={i} label={m.label} value={m.value} sub={m.sub} highlight={m.highlight} />
        ))}
      </div>
      {footer && <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#475569' }}>{footer}</div>}
    </div>
  )
}

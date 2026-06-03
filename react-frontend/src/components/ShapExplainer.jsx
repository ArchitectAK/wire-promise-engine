export default function ShapExplainer({ shapTop3 }) {
  if (!shapTop3 || shapTop3.length === 0) return null
  const maxImpact = Math.max(...shapTop3.map(s => Math.abs(s.impact_days))) || 1

  return (
    <div style={{ background: '#1e2533', borderRadius: '12px', padding: '20px 24px', borderLeft: '5px solid #a855f7', marginBottom: '16px' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>
        EXPLAINABILITY
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>
        🔍 Top 3 Feature Drivers (SHAP-proxy)
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '14px' }}>
        Red = adding days (delay) &nbsp;|&nbsp; Green = reducing days (accelerating)
      </div>
      {shapTop3.map(({ feature, impact_days, description }) => {
        const barWidth = Math.round((Math.abs(impact_days) / maxImpact) * 180)
        const positive = impact_days > 0
        const color = positive ? '#ef4444' : '#22c55e'
        const label = feature.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        const sign = positive ? '+' : ''

        return (
          <div key={feature} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '200px', fontSize: '0.82rem', color: '#94a3b8', flexShrink: 0 }}>{label}</div>
              <div style={{ width: `${barWidth}px`, height: '14px', background: color, borderRadius: '4px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{sign}{impact_days.toFixed(2)} days</div>
            </div>
            <div style={{ marginLeft: '210px', fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>{description}</div>
          </div>
        )
      })}
    </div>
  )
}

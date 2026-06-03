const RISK_COLORS = { LOW: '#16a34a', MEDIUM: '#ca8a04', HIGH: '#dc2626' }

export default function PromisePanel({ layer4, layer5 }) {
  const riskColor = RISK_COLORS[layer5.otif_risk_label] || '#64748b'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 60%, #1e2533)',
      border: '2px solid #3b82f6',
      borderRadius: '16px',
      padding: '28px 32px',
      marginBottom: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase' }}>
        ★ Final Promise Date (P50 Commit)
      </div>
      <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#60a5fa', margin: '8px 0' }}>
        {layer4.promise_date_p50}
      </div>
      <div style={{ fontSize: '0.92rem', color: '#64748b' }}>
        Confidence band: &nbsp;
        <strong style={{ color: '#94a3b8' }}>{layer4.promise_date_p10}</strong>
        &nbsp;→&nbsp;
        <strong style={{ color: '#94a3b8' }}>{layer4.promise_date_p90}</strong>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span style={{
          background: riskColor, color: '#fff',
          borderRadius: '6px', padding: '3px 14px',
          fontWeight: 700, fontSize: '0.85rem',
        }}>
          {layer5.otif_risk_label} OTIF RISK ({(layer5.otif_risk_probability * 100).toFixed(0)}%)
        </span>
      </div>
    </div>
  )
}

const TIERS = [
  {
    key: 'p10',
    label: 'P10 — Optimistic (10th percentile)',
    color: '#22c55e',
    tagBg: '#166534',
    tagText: '#dcfce7',
    emoji: '🟢',
    note: 'Best-case if everything runs smoothly',
  },
  {
    key: 'p50',
    label: 'P50 ★ COMMIT DATE (Median)',
    color: '#3b82f6',
    tagBg: '#1e3a8a',
    tagText: '#dbeafe',
    emoji: '🔵',
    note: 'This is the date to promise to the customer',
    highlight: true,
  },
  {
    key: 'p90',
    label: 'P90 — Conservative (90th percentile)',
    color: '#f97316',
    tagBg: '#7c2d12',
    tagText: '#fed7aa',
    emoji: '🟠',
    note: 'Worst-case buffer for risk planning',
  },
]

export default function Timeline({ layer4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
      {TIERS.map(({ key, label, color, tagBg, tagText, emoji, note, highlight }) => (
        <div key={key} style={{
          background: '#1e2533',
          borderLeft: `4px solid ${color}`,
          border: highlight ? `2px solid ${color}` : `1px solid #1e2533`,
          borderLeftWidth: '4px',
          borderLeftColor: color,
          borderRadius: '10px',
          padding: '16px 18px',
        }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ background: tagBg, color: tagText, borderRadius: '6px', padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700 }}>
              {emoji} {layer4[`${key}_days`].toFixed(0)} days
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', color: highlight ? '#93c5fd' : color, fontWeight: highlight ? 700 : 600 }}>
            {layer4[`promise_date_${key}`]}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '6px' }}>{note}</div>
        </div>
      ))}
    </div>
  )
}

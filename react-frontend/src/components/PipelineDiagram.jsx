const LAYERS = [
  { tag: 'L1', color: '#22c55e', name: 'Run Rate\nRefiner',     model: 'Ridge\nRegression' },
  { tag: 'L2', color: '#a855f7', name: 'Multi-Order\nAdjuster', model: 'Random\nForest' },
  { tag: 'L3', color: '#f97316', name: 'Setup Time\nCalculator',model: 'Gradient\nBoosting' },
  { tag: 'L4', color: '#3b82f6', name: 'Promise Date\nPredictor',model: 'RF Quantile\n500 trees' },
  { tag: 'L5', color: '#ef4444', name: 'OTIF Risk\nScorer',     model: 'RF Classifier' },
]

export default function PipelineDiagram() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'nowrap', overflowX: 'auto', padding: '8px 0' }}>
      {LAYERS.map(({ tag, color, name, model }, i) => (
        <div key={tag} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            background: '#1e2533',
            border: `2px solid ${color}`,
            borderRadius: '10px',
            padding: '14px 12px',
            textAlign: 'center',
            minWidth: '110px',
          }}>
            <div style={{ background: color, color: '#fff', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '8px', display: 'inline-block' }}>
              {tag}
            </div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{name}</div>
            <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4px', whiteSpace: 'pre-line' }}>{model}</div>
          </div>
          {i < LAYERS.length - 1 && (
            <div style={{ color: '#334155', fontSize: '1.3rem', margin: '0 4px' }}>→</div>
          )}
        </div>
      ))}
    </div>
  )
}

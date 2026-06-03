export default function GuardrailWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) return null
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316', marginBottom: '8px' }}>⚠ Guardrail Warnings</div>
      {warnings.map((w, i) => (
        <div key={i} style={{
          background: '#431407',
          borderLeft: '4px solid #f97316',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '8px',
          color: '#fed7aa',
          fontSize: '0.87rem',
        }}>
          ⚠ {w}
        </div>
      ))}
    </div>
  )
}

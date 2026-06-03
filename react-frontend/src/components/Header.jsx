export default function Header() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a, #1e2533)',
      padding: '20px 28px',
      borderBottom: '3px solid #3b82f6',
    }}>
      <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
        🏭 Wire Manufacturing AI — Promise Date Engine
      </h1>
      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
        5-Layer Machine Learning Pipeline &nbsp;|&nbsp;
        Run Rate Refiner → Multi-Order Adjuster → Setup Optimizer → Probabilistic Predictor → OTIF Scorer
      </p>
    </div>
  )
}

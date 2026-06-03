import PipelineDiagram from './PipelineDiagram'

const LAYERS = [
  { color: '#22c55e', title: '① Run Rate Refiner',     desc: 'Adjusts mill throughput for wire diameter, item type, and seasonal factors using Ridge Regression' },
  { color: '#a855f7', title: '② Multi-Order Adjuster',  desc: 'Accounts for queue contention, concurrent orders, and mill loading using Random Forest' },
  { color: '#f97316', title: '③ Setup Time Calculator', desc: 'Optimizes setup sequence for diameter transitions using Gradient Boosting — saves vs. random order' },
  { color: '#3b82f6', title: '④ Promise Date Predictor',desc: '500-tree Random Forest quantile model → P10 / P50 / P90 delivery dates with confidence intervals' },
  { color: '#ef4444', title: '⑤ OTIF Risk Scorer',      desc: 'Classifies delivery risk (LOW / MEDIUM / HIGH) using balanced Random Forest Classifier' },
]

export default function LandingPage() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏭</div>
        <h2 style={{ color: '#f1f5f9', marginBottom: '8px', fontWeight: 800 }}>
          Wire Manufacturing AI Promise Engine
        </h2>
        <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Enter a sales order in the sidebar (or upload a CSV) to run it through the
          full 5-layer ML pipeline and receive a transparent, explainable promise date.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', textAlign: 'center' }}>
          How It Works
        </h3>
        <PipelineDiagram />
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
        {LAYERS.map(({ color, title, desc }) => (
          <div key={title} style={{
            background: '#1e2533',
            borderLeft: `4px solid ${color}`,
            borderRadius: '10px',
            padding: '16px',
            flex: '1',
            minWidth: '180px',
          }}>
            <div style={{ fontWeight: 700, color, marginBottom: '6px', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px 20px', marginTop: '20px', borderLeft: '4px solid #334155' }}>
        <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>📋 Sample CSV Format</div>
        <code style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.7 }}>
          order_id, item_type, wire_diameter_mm, qty_ordered_kg, package_code, mill_assigned, order_date,
          num_lines_per_SO, total_qty_per_SO, unique_diameters_per_SO, diameter_group_load_kg,
          concurrent_orders_this_week, concurrent_same_mill_orders, week_total_load_kg,
          previous_order_diameter_on_mill
        </code>
      </div>
    </div>
  )
}

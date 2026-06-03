import { useState } from 'react'
import PromisePanel from './PromisePanel'
import Timeline from './Timeline'
import LayerCard from './LayerCard'
import ShapExplainer from './ShapExplainer'
import GuardrailWarnings from './GuardrailWarnings'

function sign(v) { return v >= 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%` }

function colorPct(v, positiveIsBad = false) {
  const bad = positiveIsBad ? v > 0 : v < 0
  return bad ? '#ef4444' : '#22c55e'
}

export default function ReportView({ report }) {
  const [showJson, setShowJson] = useState(false)
  const { layer1, layer2, layer3, layer4, layer5, shap_top3, guardrail_warnings, order_id, order_date } = report

  const exceedPct = (layer4.prob_exceed_42d * 100).toFixed(1)
  const guardBadge = layer4.guardrail_flag
    ? <span style={{ background: '#dc2626', color: '#fee2e2', borderRadius: '6px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>⚠ EXCEEDS 42-DAY LIMIT</span>
    : <span style={{ background: '#16a34a', color: '#dcfce7', borderRadius: '6px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 700 }}>✓ PASS</span>

  const riskLabel = layer5.otif_risk_label
  const riskProb  = (layer5.otif_risk_probability * 100)
  const riskColor = riskLabel === 'LOW' ? '#16a34a' : riskLabel === 'MEDIUM' ? '#ca8a04' : '#dc2626'
  const riskBg    = riskLabel === 'LOW' ? '#14532d' : riskLabel === 'MEDIUM' ? '#713f12' : '#7f1d1d'

  const gaugeBlocks = Math.round(riskProb / 5)

  const downloadReport = () => {
    const shapLines = shap_top3.map((s, i) =>
      `  ${i+1}. ${s.feature.padEnd(30)} ${s.impact_days >= 0 ? '+' : ''}${s.impact_days.toFixed(2)} days — ${s.description}`
    ).join('\n')
    const warnLines = guardrail_warnings.length ? guardrail_warnings.map(w => `  ⚠ ${w}`).join('\n') : '  None'

    const text = `WIRE MANUFACTURING AI — PROMISE DATE REPORT
Order ID   : ${order_id}
Order Date : ${order_date}

LAYER 1 — RUN RATE REFINER
  Nominal Run Rate    : ${layer1.nominal_run_rate_kghr.toFixed(1)} kg/hr
  Adjusted Run Rate   : ${layer1.adjusted_run_rate_kghr.toFixed(1)} kg/hr  (${layer1.adjustment_pct >= 0 ? '+' : ''}${layer1.adjustment_pct.toFixed(1)}%)

LAYER 2 — MULTI-ORDER INTERACTION ADJUSTER
  Base Lead Time      : ${layer2.base_lead_time_days.toFixed(1)} days
  Queue-Adjusted      : ${layer2.queue_adjusted_days.toFixed(1)} days  (${layer2.queue_contention_pct >= 0 ? '+' : ''}${layer2.queue_contention_pct.toFixed(1)}% queue effect)

LAYER 3 — SETUP TIME CASCADING CALCULATOR
  Random Sequence     : ${layer3.random_setup_min.toFixed(0)} min
  ML-Optimized Setup  : ${layer3.ml_optimized_setup_min.toFixed(0)} min  (${layer3.setup_savings_pct.toFixed(1)}% savings)
  Day Adjustment      : ${layer3.setup_adjustment_days >= 0 ? '+' : ''}${layer3.setup_adjustment_days.toFixed(2)} days

LAYER 4 — PROBABILISTIC PROMISE DATE PREDICTOR
  P10 (Optimistic)    : ${layer4.p10_days.toFixed(0)} days  → ${layer4.promise_date_p10}
  P50 (Commit) ★      : ${layer4.p50_days.toFixed(0)} days  → ${layer4.promise_date_p50}
  P90 (Conservative)  : ${layer4.p90_days.toFixed(0)} days  → ${layer4.promise_date_p90}
  Prob. exceed 42 days: ${exceedPct}%
  6-Week Guardrail    : ${layer4.guardrail_flag ? 'EXCEEDS LIMIT ⚠' : 'PASS ✓'}

LAYER 5 — OTIF RISK SCORER
  Risk Probability    : ${riskProb.toFixed(1)}%
  Risk Label          : ${riskLabel}

TOP 3 FEATURE DRIVERS
${shapLines}

GUARDRAIL WARNINGS
${warnLines}

★ FINAL PROMISE DATE : ${layer4.promise_date_p50}
  Confidence Band    : ${layer4.promise_date_p10}  →  ${layer4.promise_date_p90}
  OTIF Risk          : ${riskLabel} (${riskProb.toFixed(0)}%)
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `promise_report_${order_id}_${new Date().toISOString().slice(0,10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PromisePanel layer4={layer4} layer5={layer5} />

      <h3 style={{ color: '#f1f5f9', marginBottom: '12px' }}>📊 Probability Timeline</h3>
      <Timeline layer4={layer4} />

      <h3 style={{ color: '#f1f5f9', marginBottom: '12px' }}>🔬 Pipeline Transparency — All 5 Layers</h3>

      {/* Layer 1 */}
      <LayerCard
        number={1} color="#22c55e" icon="🔧" title="Run Rate Refiner" model="Ridge Regression"
        metrics={[
          { label: 'Nominal Mill Rate', value: `${layer1.nominal_run_rate_kghr.toFixed(0)} kg/hr`, sub: 'From mill spec table' },
          { label: 'ML-Adjusted Rate',  value: `${layer1.adjusted_run_rate_kghr.toFixed(0)} kg/hr`, sub: 'After diameter, item-type & seasonal adjustments' },
          { label: 'Adjustment',        value: <span style={{ color: colorPct(layer1.adjustment_pct) }}>{sign(layer1.adjustment_pct)}</span>, sub: 'vs. nominal rate' },
        ]}
      />

      {/* Layer 2 */}
      <LayerCard
        number={2} color="#a855f7" icon="📦" title="Multi-Order Interaction Adjuster" model="Random Forest"
        metrics={[
          { label: 'Base Lead Time',  value: `${layer2.base_lead_time_days.toFixed(1)} days`, sub: 'qty ÷ (adj.rate × 8 hrs)' },
          { label: 'Queue-Adjusted',  value: `${layer2.queue_adjusted_days.toFixed(1)} days`, sub: 'After multi-order contention' },
          { label: 'Queue Contention',value: <span style={{ color: colorPct(layer2.queue_contention_pct, true) }}>{sign(layer2.queue_contention_pct)}</span>, sub: 'vs. base lead time' },
        ]}
      />

      {/* Layer 3 */}
      <LayerCard
        number={3} color="#f97316" icon="⚙️" title="Setup Time Cascading Calculator" model="Gradient Boosting"
        metrics={[
          { label: 'Random Sequence Setup', value: `${layer3.random_setup_min.toFixed(0)} min`, sub: 'Heuristic rule-based estimate' },
          { label: 'ML-Optimized Setup',    value: `${layer3.ml_optimized_setup_min.toFixed(0)} min`, sub: 'After smart sequencing' },
          { label: 'Savings',               value: <span style={{ color: '#22c55e' }}>{layer3.setup_savings_pct.toFixed(1)}%</span>, sub: 'Setup time reduction' },
          { label: 'Day Adjustment',        value: <span style={{ color: layer3.setup_adjustment_days <= 0 ? '#22c55e' : '#ef4444' }}>{layer3.setup_adjustment_days >= 0 ? '+' : ''}{layer3.setup_adjustment_days.toFixed(2)} days</span>, sub: 'Applied to promise date' },
        ]}
      />

      {/* Layer 4 */}
      <LayerCard
        number={4} color="#3b82f6" icon="📅" title="Probabilistic Promise Date Predictor" model="Random Forest — 500 trees"
        metrics={[
          { label: 'P10 — Optimistic',     value: `${layer4.p10_days.toFixed(0)} days`, sub: layer4.promise_date_p10 },
          { label: 'P50 — Commit Date ★',  value: `${layer4.p50_days.toFixed(0)} days`, sub: layer4.promise_date_p50, highlight: true },
          { label: 'P90 — Conservative',   value: `${layer4.p90_days.toFixed(0)} days`, sub: layer4.promise_date_p90 },
          { label: 'Prob. Exceed 42 days', value: <span style={{ color: parseFloat(exceedPct) > 30 ? '#ef4444' : parseFloat(exceedPct) > 10 ? '#f97316' : '#22c55e' }}>{exceedPct}%</span>, sub: <span>6-Week Guardrail: {guardBadge}</span> },
        ]}
      />

      {/* Layer 5 */}
      <div style={{ background: '#1e2533', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', borderLeft: '5px solid #ef4444' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>LAYER 5</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px' }}>
          🎯 OTIF Risk Scorer <span style={{ fontWeight: 400, fontSize: '0.78rem', color: '#64748b' }}>(Random Forest Classifier)</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 16px', minWidth: '150px' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Probability</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: riskColor, marginTop: '2px' }}>{riskProb.toFixed(1)}%</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>of missing On-Time delivery</div>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 16px', minWidth: '260px' }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Level</div>
            <div style={{ marginTop: '6px' }}>
              <span style={{ background: riskBg, color: riskLabel === 'LOW' ? '#dcfce7' : riskLabel === 'MEDIUM' ? '#fef9c3' : '#fee2e2', borderRadius: '6px', padding: '4px 14px', fontWeight: 700, fontSize: '0.9rem' }}>
                {riskLabel} RISK
              </span>
            </div>
            <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '0.82rem', color: riskColor, letterSpacing: '2px' }}>
              {'█'.repeat(gaugeBlocks)}{'░'.repeat(20 - gaugeBlocks)} {riskProb.toFixed(0)}%
            </div>
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.76rem', color: '#475569' }}>
          Threshold: &lt;35% = LOW &nbsp;|&nbsp; 35–65% = MEDIUM &nbsp;|&nbsp; &gt;65% = HIGH
        </div>
      </div>

      {/* SHAP */}
      <h3 style={{ color: '#f1f5f9', marginBottom: '12px' }}>🔍 Explainability</h3>
      <ShapExplainer shapTop3={shap_top3} />

      {/* Guardrail warnings */}
      <GuardrailWarnings warnings={guardrail_warnings} />

      {/* JSON viewer */}
      <div style={{ marginBottom: '16px' }}>
        <button
          className="btn-secondary"
          onClick={() => setShowJson(v => !v)}
          style={{ marginBottom: '8px' }}
        >
          {showJson ? '▲ Hide Raw Report (JSON)' : '📋 View Raw Report (JSON)'}
        </button>
        {showJson && (
          <pre style={{
            background: '#0f172a', border: '1px solid #1e2533', borderRadius: '8px',
            padding: '16px', fontSize: '0.75rem', color: '#94a3b8',
            overflowX: 'auto', maxHeight: '400px', overflowY: 'auto',
          }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        )}
      </div>

      {/* Download */}
      <button className="btn-download" onClick={downloadReport}>
        ⬇ Download Report (.txt)
      </button>
    </div>
  )
}

import { useState } from 'react'
import ReportView from './ReportView'

const RISK_COLORS = {
  LOW:    { bg: '#14532d', text: '#dcfce7' },
  MEDIUM: { bg: '#713f12', text: '#fef9c3' },
  HIGH:   { bg: '#7f1d1d', text: '#fee2e2' },
}

export default function BatchResults({ results, errors }) {
  const [selected, setSelected] = useState(null)

  if (!results || results.length === 0) {
    return <div style={{ color: '#94a3b8' }}>No results to display.</div>
  }

  const selectedReport = selected ? results.find(r => r.order_id === selected) : null

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', marginBottom: '16px' }}>
        📤 Batch Prediction — {results.length} order(s)
      </h3>

      {errors && errors.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {errors.map((e, i) => (
            <div key={i} style={{ background: '#431407', borderLeft: '4px solid #ef4444', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '6px' }}>
              ⚠ Order <strong>{e.order_id}</strong>: {e.error}
            </div>
          ))}
        </div>
      )}

      <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1e2533' }}>
              {['Order ID','Promise Date (P50)','P10 Date','P90 Date','P50 Days','OTIF Risk','Risk %','Guardrail'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const risk = r.layer5.otif_risk_label
              const rc = RISK_COLORS[risk] || { bg: '#1e2533', text: '#94a3b8' }
              const isSelected = selected === r.order_id
              return (
                <tr
                  key={r.order_id}
                  style={{
                    background: isSelected ? '#1d4ed8' : i % 2 === 0 ? '#0f172a' : '#131c2e',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onClick={() => setSelected(isSelected ? null : r.order_id)}
                >
                  <td style={{ padding: '10px 14px', color: '#60a5fa', fontWeight: 700 }}>{r.order_id}</td>
                  <td style={{ padding: '10px 14px', color: '#f1f5f9', fontWeight: 700 }}>{r.layer4.promise_date_p50}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{r.layer4.promise_date_p10}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{r.layer4.promise_date_p90}</td>
                  <td style={{ padding: '10px 14px', color: '#f1f5f9' }}>{r.layer4.p50_days.toFixed(0)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: rc.bg, color: rc.text, borderRadius: '6px', padding: '3px 10px', fontWeight: 700, fontSize: '0.78rem' }}>
                      {risk}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#f1f5f9' }}>{(r.layer5.otif_risk_probability * 100).toFixed(0)}%</td>
                  <td style={{ padding: '10px 14px' }}>
                    {r.layer4.guardrail_flag
                      ? <span style={{ color: '#f97316', fontWeight: 700 }}>⚠ EXCEED</span>
                      : <span style={{ color: '#22c55e', fontWeight: 700 }}>✓ PASS</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
            Showing detail for <strong style={{ color: '#60a5fa' }}>{selectedReport.order_id}</strong> — click the row again to collapse
          </div>
          <div style={{ border: '1px solid #1e2533', borderRadius: '12px', padding: '24px', background: '#0a0f1e' }}>
            <ReportView report={selectedReport} />
          </div>
        </div>
      )}
    </div>
  )
}

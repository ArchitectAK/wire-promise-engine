import { useState } from 'react'

const ITEM_TYPES = ['WHF','PHF','WSA','WCH','WTE','WDG','WGA','WSP','WDU']
const ITEM_NAMES = {
  WHF: 'WHF — Wire Hard Fine', PHF: 'PHF — Plain Hard Fine',
  WSA: 'WSA — Wire Soft Annealed', WCH: 'WCH — Wire Chain',
  WTE: 'WTE — Wire Tempered', WDG: 'WDG — Wire Drawn Galvanized',
  WGA: 'WGA — Wire Galvanized Annealed', WSP: 'WSP — Wire Spring',
  WDU: 'WDU — Wire Drawn Uncoated',
}
const DIAMETERS     = [1.2, 1.6, 2.0, 2.4, 2.8, 3.2]
const PACKAGE_CODES = ['KH','DJ','MC','L1','L2','KH1','SP1','SP2','PP']
const MILLS         = ['Mill_A','Mill_B','Mill_C','Mill_D','Mill_E']

const today = new Date().toISOString().split('T')[0]
const defaultOrderId = `SO-${today.replace(/-/g, '')}-001`

const DEFAULTS = {
  order_id: defaultOrderId,
  order_date: today,
  item_type: 'WHF',
  wire_diameter_mm: 2.0,
  qty_ordered_kg: 10000,
  package_code: 'KH',
  mill_assigned: 'Mill_A',
  num_lines_per_SO: 3,
  total_qty_per_SO: 20000,
  unique_diameters_per_SO: 2,
  concurrent_orders_this_week: 10,
  concurrent_same_mill_orders: 3,
  week_total_load_kg: 120000,
  diameter_group_load_kg: 200000,
  previous_order_diameter_on_mill: 2.0,
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3b82f6', margin: '18px 0 10px', borderBottom: '1px solid #1e2533', paddingBottom: '4px' }}>
      {children}
    </div>
  )
}

export default function Sidebar({ mode, onModeChange, onManualSubmit, onCsvUpload, loading }) {
  const [form, setForm] = useState(DEFAULTS)
  const [csvFile, setCsvFile] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onManualSubmit({
      ...form,
      wire_diameter_mm: parseFloat(form.wire_diameter_mm),
      qty_ordered_kg: parseFloat(form.qty_ordered_kg),
      num_lines_per_SO: parseInt(form.num_lines_per_SO),
      total_qty_per_SO: parseFloat(form.total_qty_per_SO),
      unique_diameters_per_SO: parseInt(form.unique_diameters_per_SO),
      concurrent_orders_this_week: parseInt(form.concurrent_orders_this_week),
      concurrent_same_mill_orders: parseInt(form.concurrent_same_mill_orders),
      week_total_load_kg: parseFloat(form.week_total_load_kg),
      diameter_group_load_kg: parseFloat(form.diameter_group_load_kg),
      previous_order_diameter_on_mill: parseFloat(form.previous_order_diameter_on_mill),
    })
  }

  const handleCsvChange = (e) => {
    const file = e.target.files[0]
    if (file) setCsvFile(file)
  }

  const handleCsvSubmit = () => {
    if (csvFile) onCsvUpload(csvFile)
  }

  return (
    <aside style={{
      width: '300px',
      minWidth: '300px',
      background: '#131c2e',
      borderRight: '1px solid #1e2533',
      padding: '20px 16px',
      overflowY: 'auto',
      height: 'calc(100vh - 80px)',
      position: 'sticky',
      top: '80px',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '16px' }}>
        🏭 Sales Order Entry
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: '#0f172a', borderRadius: '8px', padding: '4px', marginBottom: '20px', border: '1px solid #1e2533' }}>
        <button className={`mode-tab ${mode === 'manual' ? 'active' : 'inactive'}`} onClick={() => onModeChange('manual')}>
          📝 Manual
        </button>
        <button className={`mode-tab ${mode === 'csv' ? 'active' : 'inactive'}`} onClick={() => onModeChange('csv')}>
          📤 CSV Upload
        </button>
      </div>

      {/* CSV mode */}
      {mode === 'csv' && (
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '12px' }}>
            Upload a CSV file with one or more orders. Column names must match the manual form fields.
          </p>
          <Field label="Upload CSV (.csv)">
            <input type="file" accept=".csv" onChange={handleCsvChange} style={{ padding: '6px' }} />
          </Field>
          {csvFile && (
            <p style={{ color: '#22c55e', fontSize: '0.8rem', marginBottom: '12px' }}>
              ✓ {csvFile.name} selected
            </p>
          )}
          <button className="btn-primary" onClick={handleCsvSubmit} disabled={!csvFile || loading}>
            {loading ? '⏳ Running…' : '🚀 Run Batch Predictions'}
          </button>
          <div style={{ marginTop: '20px', background: '#0f172a', borderRadius: '8px', padding: '12px', border: '1px solid #1e2533' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Required CSV columns
            </div>
            <code style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.6 }}>
              order_id, item_type, wire_diameter_mm,<br />
              qty_ordered_kg, package_code, mill_assigned,<br />
              order_date, num_lines_per_SO, total_qty_per_SO,<br />
              unique_diameters_per_SO, concurrent_orders_this_week,<br />
              concurrent_same_mill_orders, week_total_load_kg,<br />
              diameter_group_load_kg, previous_order_diameter_on_mill
            </code>
          </div>
        </div>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <form onSubmit={handleSubmit}>
          <SectionLabel>Order Identity</SectionLabel>
          <Field label="Order ID">
            <input value={form.order_id} onChange={e => set('order_id', e.target.value)} />
          </Field>
          <Field label="Order Date">
            <input type="date" value={form.order_date} onChange={e => set('order_date', e.target.value)} />
          </Field>

          <SectionLabel>Product Details</SectionLabel>
          <Field label="Item Type">
            <select value={form.item_type} onChange={e => set('item_type', e.target.value)}>
              {ITEM_TYPES.map(t => <option key={t} value={t}>{ITEM_NAMES[t]}</option>)}
            </select>
          </Field>
          <Field label="Wire Diameter (mm)">
            <select value={form.wire_diameter_mm} onChange={e => set('wire_diameter_mm', e.target.value)}>
              {DIAMETERS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Quantity Ordered (kg)">
            <input type="number" min="100" max="100000" step="500" value={form.qty_ordered_kg} onChange={e => set('qty_ordered_kg', e.target.value)} />
          </Field>
          <Field label="Package Code">
            <select value={form.package_code} onChange={e => set('package_code', e.target.value)}>
              {PACKAGE_CODES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Mill Assigned">
            <select value={form.mill_assigned} onChange={e => set('mill_assigned', e.target.value)}>
              {MILLS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          <SectionLabel>SO Structure</SectionLabel>
          <Field label="Number of Lines in SO">
            <input type="number" min="1" max="20" value={form.num_lines_per_SO} onChange={e => set('num_lines_per_SO', e.target.value)} />
          </Field>
          <Field label="Total Qty Across All SO Lines (kg)">
            <input type="number" min="100" max="1000000" step="1000" value={form.total_qty_per_SO} onChange={e => set('total_qty_per_SO', e.target.value)} />
          </Field>
          <Field label="Unique Wire Diameters in SO">
            <input type="number" min="1" max="6" value={form.unique_diameters_per_SO} onChange={e => set('unique_diameters_per_SO', e.target.value)} />
          </Field>

          <SectionLabel>Queue State (Current Week)</SectionLabel>
          <Field label="Active Orders This Week">
            <input type="number" min="0" max="50" value={form.concurrent_orders_this_week} onChange={e => set('concurrent_orders_this_week', e.target.value)} />
          </Field>
          <Field label="Orders on Same Mill">
            <input type="number" min="0" max="20" value={form.concurrent_same_mill_orders} onChange={e => set('concurrent_same_mill_orders', e.target.value)} />
          </Field>
          <Field label="Total Backlog This Week (kg)">
            <input type="number" min="0" max="2000000" step="5000" value={form.week_total_load_kg} onChange={e => set('week_total_load_kg', e.target.value)} />
          </Field>
          <Field label="Same-Diameter Group Backlog (kg)">
            <input type="number" min="0" max="2000000" step="5000" value={form.diameter_group_load_kg} onChange={e => set('diameter_group_load_kg', e.target.value)} />
          </Field>
          <Field label="Previous Order Diameter on Mill (mm)">
            <select value={form.previous_order_diameter_on_mill} onChange={e => set('previous_order_diameter_on_mill', e.target.value)}>
              {DIAMETERS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '⏳ Running…' : '🚀 Calculate Promise Date'}
            </button>
          </div>
        </form>
      )}
    </aside>
  )
}

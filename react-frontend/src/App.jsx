import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LandingPage from './components/LandingPage'
import ReportView from './components/ReportView'
import BatchResults from './components/BatchResults'
import { predictSingle, predictBatch } from './api'

export default function App() {
  const [mode, setMode] = useState('manual')
  const [report, setReport] = useState(null)
  const [batchData, setBatchData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleModeChange = (m) => {
    setMode(m)
    setReport(null)
    setBatchData(null)
    setError(null)
  }

  const handleManualSubmit = async (orderData) => {
    setLoading(true)
    setError(null)
    setReport(null)
    setBatchData(null)
    try {
      const result = await predictSingle(orderData)
      setReport(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCsvUpload = async (file) => {
    setLoading(true)
    setError(null)
    setReport(null)
    setBatchData(null)
    try {
      const result = await predictBatch(file)
      setBatchData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const renderMain = () => {
    if (loading) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
        <div className="spinner" />
        <p style={{ color: '#94a3b8', margin: 0 }}>Running through 5-layer ML pipeline…</p>
      </div>
    )
    if (error) return (
      <div style={{ background: '#431407', border: '1px solid #ef4444', borderRadius: '10px', padding: '20px', color: '#fca5a5' }}>
        <strong style={{ color: '#f97316' }}>⚠ Error:</strong> {error}
      </div>
    )
    if (mode === 'csv' && batchData) return <BatchResults results={batchData.results} errors={batchData.errors} />
    if (report) return <ReportView report={report} />
    return <LandingPage />
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar
          mode={mode}
          onModeChange={handleModeChange}
          onManualSubmit={handleManualSubmit}
          onCsvUpload={handleCsvUpload}
          loading={loading}
        />
        <main style={{ flex: 1, padding: '24px', minHeight: 'calc(100vh - 80px)', overflow: 'auto' }}>
          {renderMain()}
        </main>
      </div>
    </div>
  )
}

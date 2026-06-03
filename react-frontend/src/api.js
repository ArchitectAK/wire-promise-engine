import axios from 'axios'

// In dev, Vite proxy handles /predict. In production, VITE_API_URL points to the Render backend.
const BASE = import.meta.env.VITE_API_URL || ''

export async function predictSingle(orderData) {
  try {
    const { data } = await axios.post(`${BASE}/predict`, orderData)
    return data
  } catch (err) {
    const msg = err.response?.data?.detail || err.message || 'Prediction failed'
    throw new Error(msg)
  }
}

export async function predictBatch(file) {
  const form = new FormData()
  form.append('file', file)
  try {
    const { data } = await axios.post(`${BASE}/predict/batch`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (err) {
    const msg = err.response?.data?.detail || err.message || 'Batch prediction failed'
    throw new Error(msg)
  }
}

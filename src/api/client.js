import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

// ── Products ──────────────────────────────────────────────────────────────────
export const fetchProducts = (params = {}) => api.get('/products', { params })
export const fetchProductById = (id) => api.get(`/products/${id}`)

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder = (orderData) => api.post('/orders', orderData)
export const fetchOrderById = (id) => api.get(`/orders/${id}`)
export const fetchOrdersByPhone = (phone) => api.get(`/orders/by-phone/${phone}`)

// ── Payment ───────────────────────────────────────────────────────────────────
export const initiateJazzCash = (payload) => api.post('/payment/jazzcash', payload)
export const verifyJazzCash = (payload) => api.post('/payment/jazzcash/verify', payload)

// ── Newsletter ────────────────────────────────────────────────────────────────
export const subscribeNewsletter = (email) => api.post('/newsletter', { email })

export default api

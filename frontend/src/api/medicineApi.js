import axios from 'axios'

// Single base URL: the API Gateway. The gateway routes:
//   /api/auth/**      -> user-service
//   /api/medicines/** -> medicine-service
//
// In dev this defaults to the local gateway. In production, set
// VITE_API_BASE_URL at build time (e.g. "/api" when the frontend and API are
// served behind the same CloudFront domain, or the full gateway URL otherwise).
let rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
if (rawBase && !rawBase.startsWith('http://') && !rawBase.startsWith('https://') && !rawBase.startsWith('/')) {
  rawBase = `https://${rawBase}`
}
if (rawBase && !rawBase.endsWith('/api') && !rawBase.includes('/api/')) {
  rawBase = `${rawBase.replace(/\/+$/, '')}/api`
}
const baseURL = rawBase

const api = axios.create({
  baseURL,
})

// --- Token handling (centralized) ---
// We keep the JWT in localStorage so a page refresh doesn't log the user out.
// The interceptor below attaches it as "Authorization: Bearer <token>" on
// every request, so individual calls don't have to think about auth.
const TOKEN_KEY = 'auth.token'

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Attach the token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Auth API (user-service via gateway) ---

// Step 1: ask the backend to "send" an OTP to this mobile number.
// In dev the OTP is a fixed value (123456); this just triggers/logs it.
export function requestOtp(mobileNumber) {
  return api.post('/auth/request-otp', { mobileNumber }).then((res) => res.data)
}

// Step 2: verify the OTP. On success resolves to { token, role }.
export function verifyOtp(mobileNumber, otp) {
  return api.post('/auth/verify-otp', { mobileNumber, otp }).then((res) => res.data)
}

// --- Medicine API (medicine-service via gateway) ---

// Get all medicines, or search by name if a term is given.
// Response omits stock quantity unless the caller is an authenticated owner.
export function getMedicines(search) {
  const params = search ? { search } : {}
  return api.get('/medicines', { params }).then((res) => res.data)
}

// Add a new medicine (owner only)
export function addMedicine(medicine) {
  return api.post('/medicines', medicine).then((res) => res.data)
}

// Update an existing medicine by id (owner only)
export function updateMedicine(id, medicine) {
  return api.put(`/medicines/${id}`, medicine).then((res) => res.data)
}

// Delete a medicine by id (owner only)
export function deleteMedicine(id) {
  return api.delete(`/medicines/${id}`)
}

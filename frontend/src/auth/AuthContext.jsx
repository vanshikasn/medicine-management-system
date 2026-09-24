import { createContext, useContext, useState } from 'react'

import { setAuthToken, getAuthToken } from '../api/medicineApi.js'

// Holds the current auth state (token + role) and exposes login/logout.
// Any component can read this via the useAuth() hook below.
const AuthContext = createContext(null)

const ROLE_KEY = 'auth.role'

export function AuthProvider({ children }) {
  // Initialize from localStorage so a refresh keeps the user logged in.
  const [token, setToken] = useState(() => getAuthToken())
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY))

  // Called after a successful OTP verification.
  function login(newToken, newRole) {
    setAuthToken(newToken) // stores token (used by the axios interceptor)
    localStorage.setItem(ROLE_KEY, newRole)
    setToken(newToken)
    setRole(newRole)
  }

  // Clears everything -> back to a public visitor.
  function logout() {
    setAuthToken(null)
    localStorage.removeItem(ROLE_KEY)
    setToken(null)
    setRole(null)
  }

  const value = {
    token,
    role,
    isLoggedIn: Boolean(token),
    isOwner: role === 'ROLE_OWNER',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Convenience hook so components can do: const { isOwner, login } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import theme from './theme.js'
import { AuthProvider } from './auth/AuthContext.jsx'
import './i18n/i18n.js' // initialize translations

// Render the app, wrapped with the tools that the whole app needs:
// - BrowserRouter: enables multiple pages / URLs
// - ThemeProvider: applies our MUI theme (colors, shape) everywhere
// - CssBaseline: resets browser default styles for a clean, consistent look
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

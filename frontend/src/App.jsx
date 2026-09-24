import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'

import NavBar from './components/NavBar.jsx'
import UserPage from './pages/UserPage.jsx'
import OwnerPage from './pages/OwnerPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { useAuth } from './auth/AuthContext.jsx'

// Guards the owner route: only a logged-in owner can see it.
// Anyone else is redirected to the login page.
function RequireOwner({ children }) {
  const { isOwner } = useAuth()
  return isOwner ? children : <Navigate to="/login" replace />
}

// The top-level component. It shows the nav bar and decides which page
// to display based on the URL:
//   "/"      -> UserPage  (browse medicines, public)
//   "/login" -> LoginPage (OTP login)
//   "/owner" -> OwnerPage (manage medicines, owner only)
function App() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/owner"
            element={
              <RequireOwner>
                <OwnerPage />
              </RequireOwner>
            }
          />
        </Routes>
      </Container>
    </>
  )
}

export default App

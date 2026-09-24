import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../auth/AuthContext.jsx'

// The top navigation bar, shown on every page.
// Owner link appears only for logged-in owners; the right side shows
// Login (logged out) or Logout (logged in).
function NavBar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, isOwner, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <LocalPharmacyIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('appTitle')}
        </Typography>
        <Box>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            {t('nav.browse')}
          </Button>

          {isOwner && (
            <Button
              component={RouterLink}
              to="/owner"
              color="inherit"
              variant={location.pathname === '/owner' ? 'outlined' : 'text'}
              sx={{ ml: 1 }}
            >
              {t('nav.owner')}
            </Button>
          )}

          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
              {t('nav.logout')}
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              variant={location.pathname === '/login' ? 'outlined' : 'text'}
              sx={{ ml: 1 }}
            >
              {t('nav.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar

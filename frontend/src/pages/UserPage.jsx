import { useState, useEffect } from 'react'
import {
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
// Note: the public API deliberately omits stock quantity, so this page
// does not display stock at all.

import { getMedicines } from '../api/medicineApi.js'

// The user-facing page: browse all medicines and search by name.
function UserPage() {
  const { t } = useTranslation()

  // "state" = data that can change and, when it does, re-renders the screen
  const [medicines, setMedicines] = useState([]) // the list to show
  const [search, setSearch] = useState('') // current search text
  const [loading, setLoading] = useState(true) // whether we're fetching

  // "effect" = run some code when things change.
  // This runs on first load and whenever "search" changes, to fetch medicines.
  useEffect(() => {
    let active = true
    setLoading(true)
    getMedicines(search)
      .then((data) => {
        if (active) setMedicines(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    // cleanup guards against outdated responses updating the screen
    return () => {
      active = false
    }
  }, [search])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('user.heading')}
      </Typography>

      <TextField
        fullWidth
        placeholder={t('user.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : medicines.length === 0 ? (
        <Typography color="text.secondary">{t('user.empty')}</Typography>
      ) : (
        <Grid container spacing={2}>
          {medicines.map((m) => (
            <Grid item xs={12} sm={6} key={m.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{m.name}</Typography>
                  {m.description && (
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {m.description}
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary">
                    ₹{Number(m.price).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default UserPage

import { useState } from 'react'
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Stack,
  Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { requestOtp, verifyOtp } from '../api/medicineApi.js'
import { useAuth } from '../auth/AuthContext.jsx'

// Two-step OTP login:
//   step "mobile" -> enter mobile number, request an OTP
//   step "otp"    -> enter the OTP, verify -> log in
function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState('mobile')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleRequestOtp(event) {
    event.preventDefault()
    setError('')
    if (!mobileNumber.trim()) {
      setError(t('login.mobileRequired'))
      return
    }
    setSubmitting(true)
    requestOtp(mobileNumber.trim())
      .then(() => setStep('otp'))
      .catch(() => setError(t('login.requestFailed')))
      .finally(() => setSubmitting(false))
  }

  function handleVerifyOtp(event) {
    event.preventDefault()
    setError('')
    if (!otp.trim()) {
      setError(t('login.otpRequired'))
      return
    }
    setSubmitting(true)
    verifyOtp(mobileNumber.trim(), otp.trim())
      .then((data) => {
        login(data.token, data.role)
        // Owners go to the owner page; everyone else to browse.
        navigate(data.role === 'ROLE_OWNER' ? '/owner' : '/')
      })
      .catch(() => setError(t('login.verifyFailed')))
      .finally(() => setSubmitting(false))
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {t('login.heading')}
      </Typography>

      <Card variant="outlined">
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === 'mobile' ? (
            <Box component="form" onSubmit={handleRequestOtp}>
              <Stack spacing={2}>
                <TextField
                  label={t('login.mobile')}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <Button type="submit" variant="contained" disabled={submitting}>
                  {t('login.requestOtp')}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerifyOtp}>
              <Stack spacing={2}>
                <Typography color="text.secondary">
                  {t('login.otpSentTo', { mobile: mobileNumber })}
                </Typography>
                <TextField
                  label={t('login.otp')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {t('login.verify')}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setStep('mobile')
                      setOtp('')
                      setError('')
                    }}
                  >
                    {t('login.back')}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage

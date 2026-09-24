import { useState, useEffect } from 'react'
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from '../api/medicineApi.js'

// The owner page: add, edit, and delete medicines.
function OwnerPage() {
  const { t } = useTranslation()

  const [medicines, setMedicines] = useState([])
  const [editingId, setEditingId] = useState(null) // null = adding, otherwise editing this id

  // form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  // Load the list of medicines
  function loadMedicines() {
    getMedicines().then(setMedicines)
  }

  useEffect(() => {
    loadMedicines()
  }, [])

  function resetForm() {
    setEditingId(null)
    setName('')
    setDescription('')
    setPrice('')
    setQuantity('')
    setErrors({})
  }

  // Basic front-end validation before sending to the backend
  function validate() {
    const e = {}
    if (!name.trim()) e.name = t('validation.nameRequired')
    if (price === '') e.price = t('validation.priceRequired')
    else if (Number(price) < 0) e.price = t('validation.nonNegative')
    if (quantity === '') e.quantity = t('validation.quantityRequired')
    else if (Number(quantity) < 0) e.quantity = t('validation.nonNegative')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
    }

    const action = editingId
      ? updateMedicine(editingId, payload)
      : addMedicine(payload)

    action
      .then(() => {
        showToast(editingId ? t('messages.updated') : t('messages.added'), 'success')
        resetForm()
        loadMedicines()
      })
      .catch(() => showToast(t('messages.error'), 'error'))
  }

  function handleEdit(m) {
    setEditingId(m.id)
    setName(m.name ?? '')
    setDescription(m.description ?? '')
    setPrice(String(m.price ?? ''))
    setQuantity(String(m.quantity ?? ''))
    setErrors({})
  }

  function handleDelete(id) {
    if (!window.confirm(t('owner.confirmDelete'))) return
    deleteMedicine(id)
      .then(() => {
        showToast(t('messages.deleted'), 'success')
        if (editingId === id) resetForm()
        loadMedicines()
      })
      .catch(() => showToast(t('messages.error'), 'error'))
  }

  function showToast(message, severity) {
    setToast({ open: true, message, severity })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('owner.heading')}
      </Typography>

      {/* Add / Edit form */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingId ? t('owner.editHeading') : t('owner.addHeading')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label={t('owner.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />
              <TextField
                label={t('owner.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
              />
              <TextField
                label={t('owner.price')}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={Boolean(errors.price)}
                helperText={errors.price}
                fullWidth
              />
              <TextField
                label={t('owner.quantity')}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? t('owner.save') : t('owner.add')}
                </Button>
                {editingId && (
                  <Button variant="text" onClick={resetForm}>
                    {t('owner.cancel')}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* List of existing medicines */}
      {medicines.length === 0 ? (
        <Typography color="text.secondary">{t('owner.empty')}</Typography>
      ) : (
        <Card variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('owner.name')}</TableCell>
                <TableCell>{t('owner.price')}</TableCell>
                <TableCell>{t('owner.quantity')}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>₹{Number(m.price).toFixed(2)}</TableCell>
                  <TableCell>{m.quantity}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(m)} aria-label={t('owner.edit')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(m.id)}
                      aria-label={t('owner.delete')}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OwnerPage

import { createTheme } from '@mui/material/styles'

// Central place for the app's look (colors, fonts, shape).
// Change values here to restyle the whole app at once.
const theme = createTheme({
  palette: {
    primary: {
      main: '#8e2f8a', // plum
    },
    secondary: {
      main: '#b0559f', // lighter plum accent
    },
    background: {
      default: '#f8f4f7', // soft plum-tinted background
    },
  },
  shape: {
    borderRadius: 10, // slightly rounded corners for a friendly feel
  },
  typography: {
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
})

export default theme

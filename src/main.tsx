import { StrictMode, useMemo, useState, useEffect } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import Box from '@mui/material/Box'
import App from './App.tsx'

const THEME_MODE_KEY = 'whisper-transcribe-theme-mode'

function AppWithTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(THEME_MODE_KEY) as 'light' | 'dark' | null
    return stored === 'light' || stored === 'dark' ? stored : 'light'
  })

  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, mode)
  }, [mode])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FF3334',
          },
          ...(mode === 'light'
            ? {}
            : {
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
        typography: {
          fontFamily: '"Exo 2", sans-serif',
        },
      }),
    [mode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <IconButton
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <App />
      </Box>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithTheme />
  </StrictMode>
)

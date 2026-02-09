import { useMemo, useState, useEffect } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Box,
} from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'

const THEME_MODE_KEY = 'whisper-transcribe-theme-mode'

type Props = {
  children: React.ReactNode
}

const ThemeWrapper = ({ children }: Props) => {
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
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default ThemeWrapper

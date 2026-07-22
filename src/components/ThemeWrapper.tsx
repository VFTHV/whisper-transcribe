import { useMemo, useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import type { PaletteMode } from '@mui/material'
import { getAppTheme } from '../theme/theme'
import { ColorModeContext } from '../theme/ColorModeContext'

const THEME_MODE_KEY = 'whisper-transcribe-theme-mode'

type Props = {
  children: React.ReactNode
}

const ThemeWrapper = ({ children }: Props) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = localStorage.getItem(THEME_MODE_KEY) as PaletteMode | null
    return stored === 'light' || stored === 'dark' ? stored : 'light'
  })

  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, mode)
  }, [mode])

  const theme = useMemo(() => getAppTheme(mode), [mode])

  const colorMode = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ThemeWrapper

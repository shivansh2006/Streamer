'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Density = 'comfortable' | 'compact'
type ThemeMode = 'dark' | 'light'

type Preferences = {
  accent: string
  radius: number
  density: Density
  theme: ThemeMode
  enabledProviders: Record<string, boolean>
  setAccent: (c: string) => void
  setRadius: (r: number) => void
  setDensity: (d: Density) => void
  setTheme: (t: ThemeMode) => void
  setEnabledProviders: (p: Record<string, boolean>) => void
}

const PrefCtx = createContext<Preferences | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState('#e50914')
  const [radius, setRadiusState] = useState(12)
  const [density, setDensityState] = useState<Density>('comfortable')
  const [theme, setThemeState] = useState<ThemeMode>('dark')
  const [enabledProviders, setEnabledProvidersState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nf:prefs') || 'null')
      if (saved) {
        if (saved.accent) setAccentState(saved.accent)
        if (typeof saved.radius === 'number') setRadiusState(saved.radius)
        if (saved.density) setDensityState(saved.density)
        if (saved.theme) setThemeState(saved.theme)
        if (saved.enabledProviders && typeof saved.enabledProviders === 'object') setEnabledProvidersState(saved.enabledProviders)
      }
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    document.documentElement.style.setProperty('--radius', `${radius}px`)
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.setProperty('--density', density === 'compact' ? '0.85' : '1')
    try {
      localStorage.setItem(
        'nf:prefs',
        JSON.stringify({ accent, radius, density, theme, enabledProviders })
      )
    } catch {}
  }, [accent, radius, density, theme, enabledProviders])

  const value = useMemo<Preferences>(() => ({
    accent,
    radius,
    density,
    theme,
    enabledProviders,
    setAccent: setAccentState,
    setRadius: setRadiusState,
    setDensity: setDensityState,
    setTheme: setThemeState,
    setEnabledProviders: setEnabledProvidersState
  }), [accent, radius, density, theme, enabledProviders])

  return <PrefCtx.Provider value={value}>{children}</PrefCtx.Provider>
}

export function usePreferences() {
  const ctx = useContext(PrefCtx)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}
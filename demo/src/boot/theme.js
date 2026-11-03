import { defineBoot } from '#q-app'
import { Dark } from 'quasar'

import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'

const STORAGE_KEY = 'qh-docs-theme'

function readTheme () {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  }
  catch {
    return null
  }
}

export function saveTheme (isDark) {
  try {
    window.localStorage.setItem(STORAGE_KEY, isDark === true ? 'dark' : 'light')
  }
  catch {
    // storage unavailable (private mode); the toggle still works for this visit
  }
}

export default defineBoot(() => {
  const saved = readTheme()
  if (saved !== null) Dark.set(saved === 'dark')
})

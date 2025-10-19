'use client'

import { useEffect } from 'react'

export function PopupBlocker() {
  useEffect(() => {
    // Block all popups and redirects from iframes
    const blockPopup = (e: Event) => {
      const target = e.target as HTMLElement
      // Only allow user-initiated clicks on our own elements
      if (target.closest('iframe')) {
        console.warn('[Popup Blocked] Iframe click intercepted')
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Override window.open for iframes
    const originalOpen = window.open
    window.open = function (...args) {
      console.warn('[Popup Blocked] window.open intercepted:', args[0])
      return null
    }

    // Block beforeunload from iframes
    window.addEventListener('beforeunload', (e) => {
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'IFRAME') {
        console.warn('[Navigation Blocked] Iframe navigation intercepted')
        e.preventDefault()
        e.returnValue = ''
      }
    })

    // Capture all clicks
    document.addEventListener('click', blockPopup, true)

    return () => {
      window.open = originalOpen
      document.removeEventListener('click', blockPopup, true)
    }
  }, [])

  return null
}

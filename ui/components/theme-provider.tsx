'use client'

import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Listen for theme changes across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        if (e.newValue === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return <>{children}</>
}

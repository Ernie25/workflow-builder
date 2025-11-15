'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, CheckCircle } from 'lucide-react'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    
    // Simulate logout process
    setTimeout(() => {
      // Clear user session data (keeping theme preference)
      const themePreference = localStorage.getItem('theme')
      localStorage.clear()
      if (themePreference) {
        localStorage.setItem('theme', themePreference)
      }
      
      setIsLoggingOut(false)
      setLoggedOut(true)
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A] transition-colors duration-200 flex items-center justify-center p-6">
      <Card variant="outlined" className="max-w-md w-full p-8 text-center">
        {!loggedOut ? (
          <>
            <div className="w-16 h-16 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="h-8 w-8 text-error-500" />
            </div>
            
            <h1 className="text-heading-l text-slate-900 dark:text-[#F3F4F6] mb-3">
              Log Out
            </h1>
            
            <p className="text-body text-slate-600 dark:text-[#D1D5DB] mb-8">
              Are you sure you want to log out? You'll need to sign in again to access your workflows.
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="tertiary"
                onClick={() => router.push('/')}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success-500" />
            </div>
            
            <h1 className="text-heading-l text-slate-900 dark:text-[#F3F4F6] mb-3">
              Successfully Logged Out
            </h1>
            
            <p className="text-body text-slate-600 dark:text-[#D1D5DB]">
              Redirecting you to the home page...
            </p>
          </>
        )}
      </Card>
    </div>
  )
}

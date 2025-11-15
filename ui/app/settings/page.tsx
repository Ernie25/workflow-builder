'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save, Moon, Sun, Bell, Shield, Database } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    language: 'en',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    workflowAlerts: true,
    weeklyReports: true,
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    dataSharing: false,
    
    // Workflow Defaults
    autoSave: true,
    autoPublish: false,
    confirmDelete: true,
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setSettings(prev => ({ ...prev, theme: savedTheme }))
    }

    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    localStorage.setItem('theme', settings.theme)
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        theme: 'light',
        fontSize: 'medium',
        language: 'en',
        emailNotifications: true,
        pushNotifications: false,
        workflowAlerts: true,
        weeklyReports: true,
        twoFactorAuth: false,
        sessionTimeout: '30',
        dataSharing: false,
        autoSave: true,
        autoPublish: false,
        confirmDelete: true,
      }
      setSettings(defaultSettings)
      localStorage.setItem('appSettings', JSON.stringify(defaultSettings))
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A] transition-colors duration-200">
      {/* Header */}
      <header className="h-[60px] bg-white dark:bg-[#252525] border-b border-slate-200 dark:border-[#374151] px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-heading-l text-[#111827] dark:text-[#F3F4F6]">
            Settings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="tertiary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="primary" icon={<Save className="h-4 w-4" />} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Appearance Section */}
        <Card variant="outlined" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-heading-m text-slate-900 dark:text-[#F3F4F6]">
              Appearance
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-label text-slate-700 dark:text-[#D1D5DB] mb-2 block">
                Theme
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`flex-1 px-4 py-3 rounded-md border-2 transition-all ${
                    settings.theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-slate-200 dark:border-[#374151] hover:border-slate-300'
                  }`}
                >
                  <Sun className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                  <span className="text-body text-slate-900 dark:text-[#F3F4F6]">Light</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`flex-1 px-4 py-3 rounded-md border-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-slate-200 dark:border-[#374151] hover:border-slate-300'
                  }`}
                >
                  <Moon className="h-5 w-5 mx-auto mb-2 text-indigo-500" />
                  <span className="text-body text-slate-900 dark:text-[#F3F4F6]">Dark</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-label text-slate-700 dark:text-[#D1D5DB] mb-2 block">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#374151] rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="text-label text-slate-700 dark:text-[#D1D5DB] mb-2 block">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#374151] rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card variant="outlined" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-heading-m text-slate-900 dark:text-[#F3F4F6]">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Email Notifications</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Receive updates via email
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Push Notifications</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Receive browser notifications
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Workflow Alerts</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Get notified about workflow status changes
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.workflowAlerts}
                onChange={(e) => setSettings({ ...settings, workflowAlerts: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Weekly Reports</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Receive weekly activity summaries
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* Privacy & Security Section */}
        <Card variant="outlined" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-heading-m text-slate-900 dark:text-[#F3F4F6]">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Two-Factor Authentication</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Add an extra layer of security
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <div>
              <label className="text-label text-slate-700 dark:text-[#D1D5DB] mb-2 block">
                Session Timeout (minutes)
              </label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#374151] rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Data Sharing</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Share anonymous usage data
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.dataSharing}
                onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* Workflow Defaults Section */}
        <Card variant="outlined" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-heading-m text-slate-900 dark:text-[#F3F4F6]">
              Workflow Defaults
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Auto-Save</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Automatically save workflow changes
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Auto-Publish</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Automatically publish new workflows
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPublish}
                onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-body text-slate-900 dark:text-[#F3F4F6]">Confirm Delete</div>
                <div className="text-body-small text-slate-600 dark:text-[#D1D5DB]">
                  Show confirmation before deleting
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.confirmDelete}
                onChange={(e) => setSettings({ ...settings, confirmDelete: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>
      </main>
    </div>
  )
}

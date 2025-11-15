'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, User, Mail, Phone, Building, Save } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    company: 'ESP.AI',
    role: 'Administrator',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    localStorage.setItem('userProfile', JSON.stringify(profile))
    
    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A] transition-colors duration-200">
      {/* Header */}
      <header className="h-[60px] bg-white dark:bg-[#252525] border-b border-slate-200 dark:border-[#374151] px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/')}
          >
            Back
          </Button>
          <h1 className="text-heading-l text-[#111827] dark:text-[#F3F4F6]">
            Profile Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6 lg:p-8">
        <Card variant="outlined" className="p-6">
          {/* Profile Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-[#374151]">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary-700 dark:text-primary-300">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-heading-m text-slate-900 dark:text-[#F3F4F6] mb-1">
                {profile.name}
              </h2>
              <p className="text-body text-slate-600 dark:text-[#D1D5DB]">
                {profile.role}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-label text-slate-700 dark:text-[#D1D5DB] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-label text-slate-700 dark:text-[#D1D5DB] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-label text-slate-700 dark:text-[#D1D5DB] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-label text-slate-700 dark:text-[#D1D5DB] mb-2">
                Company
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-label text-slate-700 dark:text-[#D1D5DB] mb-2">
                Role
              </label>
              <Input
                type="text"
                value={profile.role}
                disabled
                className="bg-slate-50 dark:bg-[#1A1A1A] cursor-not-allowed"
              />
              <p className="text-body-small text-slate-500 dark:text-slate-400 mt-1">
                Contact your administrator to change your role
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-200 dark:border-[#374151]">
            <Button
              variant="tertiary"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}

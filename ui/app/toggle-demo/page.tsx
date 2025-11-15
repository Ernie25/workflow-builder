'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'

export default function ToggleDemoPage() {
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(true)
  const [toggle3, setToggle3] = useState(false)
  const [toggle4, setToggle4] = useState(true)
  const [toggle5, setToggle5] = useState(false)
  const [toggle6, setToggle6] = useState(true)

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-heading-xl text-[rgb(var(--text-primary))]">
            Toggle Component
          </h1>
          <p className="text-body text-[rgb(var(--text-secondary))]">
            Professional toggle switches for boolean settings
          </p>
        </div>

        {/* Basic Toggles */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Basic Toggles
          </h2>
          <div className="space-y-4">
            <div>
              <Toggle checked={toggle1} onChange={setToggle1} label="Email Notifications" />
            </div>
            <div>
              <Toggle checked={toggle2} onChange={setToggle2} label="Push Notifications" />
            </div>
            <div>
              <Toggle checked={toggle3} onChange={setToggle3} label="SMS Alerts" />
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Sizes
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-label mb-3 text-[rgb(var(--text-secondary))]">
                SMALL (20×36px)
              </p>
              <div className="space-y-3">
                <Toggle
                  size="sm"
                  checked={toggle4}
                  onChange={setToggle4}
                  label="Small toggle - Off state"
                />
                <Toggle
                  size="sm"
                  checked={true}
                  onChange={() => {}}
                  label="Small toggle - On state"
                />
              </div>
            </div>

            <div>
              <p className="text-label mb-3 text-[rgb(var(--text-secondary))]">
                MEDIUM (24×44px) - DEFAULT
              </p>
              <div className="space-y-3">
                <Toggle
                  size="md"
                  checked={toggle5}
                  onChange={setToggle5}
                  label="Medium toggle - Off state"
                />
                <Toggle
                  size="md"
                  checked={true}
                  onChange={() => {}}
                  label="Medium toggle - On state"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Disabled States */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Disabled States
          </h2>
          <div className="space-y-4">
            <Toggle
              checked={false}
              onChange={() => {}}
              disabled
              label="Disabled - Off"
            />
            <Toggle
              checked={true}
              onChange={() => {}}
              disabled
              label="Disabled - On"
            />
          </div>
        </section>

        {/* Without Labels */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Without Labels
          </h2>
          <div className="flex items-center gap-4">
            <Toggle checked={false} onChange={() => {}} />
            <Toggle checked={true} onChange={() => {}} />
            <Toggle checked={false} onChange={() => {}} size="sm" />
            <Toggle checked={true} onChange={() => {}} size="sm" />
          </div>
        </section>

        {/* Configuration Panel Example */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Configuration Panel Example
          </h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <Toggle
                checked={toggle6}
                onChange={setToggle6}
                label="Enable Two-Factor Authentication"
              />
              <p className="text-body-small pl-14 text-[rgb(var(--text-secondary))]">
                Add an extra layer of security to your account
              </p>
            </div>

            <div className="space-y-1">
              <Toggle
                checked={toggle1}
                onChange={setToggle1}
                label="Auto-save Changes"
              />
              <p className="text-body-small pl-14 text-[rgb(var(--text-secondary))]">
                Automatically save your work every 30 seconds
              </p>
            </div>

            <div className="space-y-1">
              <Toggle
                checked={toggle3}
                onChange={setToggle3}
                label="Dark Mode"
              />
              <p className="text-body-small pl-14 text-[rgb(var(--text-secondary))]">
                Switch to a darker color scheme
              </p>
            </div>
          </div>
        </section>

        {/* Current States Debug */}
        <section className="space-y-6 rounded-lg border border-[rgb(var(--border))] bg-gray-50 dark:bg-gray-900 p-6">
          <h2 className="text-heading-m text-[rgb(var(--text-primary))]">
            Current States
          </h2>
          <pre className="text-code rounded bg-gray-900 p-4 text-gray-100 dark:bg-gray-950">
{JSON.stringify(
  {
    'Email Notifications': toggle1,
    'Push Notifications': toggle2,
    'SMS Alerts': toggle3,
    'Small Toggle': toggle4,
    'Medium Toggle': toggle5,
    '2FA Enabled': toggle6,
  },
  null,
  2
)}
          </pre>
        </section>
      </div>
    </div>
  )
}

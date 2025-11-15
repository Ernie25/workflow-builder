'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { useState } from 'react'

export default function CardDemo() {
  const [clickCount, setClickCount] = useState(0)
  const [isEnabled, setIsEnabled] = useState(true)

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-heading-xl text-[rgb(var(--text-primary))]">
            Card Component
          </h1>
          <p className="text-body text-[rgb(var(--text-secondary))]">
            Reusable container component with multiple variants and hover states
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-4">
          <h2 className="text-heading-l text-[rgb(var(--text-primary))]">
            Basic Variants
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  Default variant with shadow and border
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  This card has a subtle shadow and border for depth. Perfect for main content containers.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>
                  Visible border, no shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  This card has a border without shadow. Great for grouped content.
                </p>
              </CardContent>
            </Card>

            <Card variant="flat">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>
                  No border, no shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  Minimal card with just background color. Useful for subtle grouping.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="space-y-4">
          <h2 className="text-heading-l text-[rgb(var(--text-primary))]">
            Interactive Cards (Hover Enabled)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="elevated" hover>
              <CardHeader>
                <CardTitle>Elevated Hover</CardTitle>
                <CardDescription>
                  Hover for increased shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  Shadow increases and background lightens on hover.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined" hover>
              <CardHeader>
                <CardTitle>Outlined Hover</CardTitle>
                <CardDescription>
                  Hover for border highlight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  Border becomes more prominent with subtle shadow on hover.
                </p>
              </CardContent>
            </Card>

            <Card variant="flat" hover>
              <CardHeader>
                <CardTitle>Flat Hover</CardTitle>
                <CardDescription>
                  Hover for background change
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  Background lightens/darkens subtly on hover.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Clickable Cards */}
        <section className="space-y-4">
          <h2 className="text-heading-l text-[rgb(var(--text-primary))]">
            Clickable Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              variant="elevated"
              onClick={() => setClickCount(prev => prev + 1)}
            >
              <CardHeader>
                <CardTitle>Click Counter</CardTitle>
                <CardDescription>
                  Click this card to increment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-heading-xl text-primary-600">
                    {clickCount}
                  </div>
                  <p className="text-body-small text-[rgb(var(--text-secondary))] mt-2">
                    clicks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              onClick={() => alert('Card clicked!')}
            >
              <CardHeader>
                <CardTitle>Alert Card</CardTitle>
                <CardDescription>
                  Click for an alert message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  This card will show an alert when clicked. Try it!
                </p>
              </CardContent>
            </Card>

            <Card
              variant="flat"
              onClick={() => console.log('Flat card clicked')}
            >
              <CardHeader>
                <CardTitle>Console Log</CardTitle>
                <CardDescription>
                  Click to log to console
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-[rgb(var(--text-secondary))]">
                  This card logs to the browser console when clicked.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Configuration Panel Example */}
        <section className="space-y-4">
          <h2 className="text-heading-l text-[rgb(var(--text-primary))]">
            Configuration Panel Example
          </h2>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                type="email"
                label="Email Address"
                placeholder="user@example.com"
                required
                helperText="We'll never share your email with anyone else"
              />
              
              <Input
                type="text"
                label="Display Name"
                placeholder="John Doe"
              />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-body-medium text-[rgb(var(--text-primary))]">
                    Email Notifications
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    Receive updates about your workflow
                  </div>
                </div>
                <Toggle
                  checked={isEnabled}
                  onChange={setIsEnabled}
                  size="md"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-body-medium text-[rgb(var(--text-primary))]">
                    Desktop Notifications
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    Get notified on your desktop
                  </div>
                </div>
                <Toggle
                  checked={false}
                  onChange={() => {}}
                  size="md"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="md">
                Save Changes
              </Button>
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Card Grid */}
        <section className="space-y-4">
          <h2 className="text-heading-l text-[rgb(var(--text-primary))]">
            Card Grid Layout
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Workflows', value: '24', change: '+12%' },
              { title: 'Active Tasks', value: '156', change: '+8%' },
              { title: 'Completed', value: '892', change: '+23%' },
              { title: 'Team Members', value: '12', change: '+2' },
            ].map((stat, index) => (
              <Card key={index} variant="outlined" hover>
                <CardContent className="space-y-2">
                  <div className="text-label text-[rgb(var(--text-secondary))] uppercase">
                    {stat.title}
                  </div>
                  <div className="text-heading-xl text-[rgb(var(--text-primary))]">
                    {stat.value}
                  </div>
                  <div className="text-body-small text-success-600">
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

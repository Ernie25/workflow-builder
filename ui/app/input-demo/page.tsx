'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Search } from 'lucide-react'

export default function InputDemoPage() {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [validatedEmail, setValidatedEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleEmailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValidatedEmail(value)
    
    if (value && !value.includes('@')) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-heading-xl text-gray-900 dark:text-gray-100">
            Input Component Demo
          </h1>
          <p className="text-body mt-2 text-gray-600 dark:text-gray-400">
            Professional input fields for configuration panels
          </p>
        </div>

        {/* Basic Inputs */}
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-heading-m text-gray-900 dark:text-gray-100">
            Basic Inputs
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Text Input"
              type="text"
              placeholder="Enter your name"
              helperText="This is helper text"
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              helperText="We'll never share your email"
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              required
            />
            
            <Input
              label="Number"
              type="number"
              placeholder="0"
              helperText="Enter a numeric value"
            />
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-heading-m text-gray-900 dark:text-gray-100">
            With Icons
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              leftIcon={<User className="h-4 w-4" />}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
            />
            
            <Input
              label="Search"
              type="text"
              placeholder="Search..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* States */}
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-heading-m text-gray-900 dark:text-gray-100">
            Input States
          </h2>
          
          <div className="space-y-6">
            <Input
              label="Default State"
              type="text"
              placeholder="Default input"
              helperText="This is a normal input field"
            />
            
            <Input
              label="Success State"
              type="email"
              placeholder="john@example.com"
              value="john@example.com"
              success
              helperText="Email is valid!"
            />
            
            <Input
              label="Error State"
              type="email"
              placeholder="Enter email"
              error="Please enter a valid email address"
            />
            
            <Input
              label="Disabled State"
              type="text"
              placeholder="Disabled input"
              disabled
              value="This field is disabled"
              helperText="This field cannot be edited"
            />
          </div>
        </section>

        {/* Interactive Validation */}
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-heading-m text-gray-900 dark:text-gray-100">
            Interactive Validation
          </h2>
          
          <div className="space-y-6">
            <Input
              label="Email Validation"
              type="email"
              placeholder="Enter your email"
              value={validatedEmail}
              onChange={handleEmailValidation}
              error={emailError}
              success={validatedEmail && !emailError}
              required
              leftIcon={<Mail className="h-4 w-4" />}
              helperText="Type to see live validation"
            />

            <Input
              label="Controlled Input"
              type="text"
              placeholder="Type something..."
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              helperText={`Character count: ${emailValue.length}`}
            />

            <Input
              label="Password Input"
              type="password"
              placeholder="Create password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              success={passwordValue.length >= 8}
              error={passwordValue.length > 0 && passwordValue.length < 8 ? 'Password must be at least 8 characters' : ''}
              helperText="Minimum 8 characters"
              required
            />
          </div>
        </section>

        {/* Configuration Panel Example */}
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-heading-m text-gray-900 dark:text-gray-100">
            Configuration Panel Example
          </h2>
          <p className="text-body-small text-gray-600 dark:text-gray-400">
            Typical use case in workflow settings
          </p>
          
          <div className="space-y-6">
            <Input
              label="API Endpoint"
              type="text"
              placeholder="https://api.example.com"
              required
              helperText="The base URL for API requests"
            />
            
            <Input
              label="API Key"
              type="password"
              placeholder="sk_live_..."
              required
              leftIcon={<Lock className="h-4 w-4" />}
              helperText="Keep this secret and secure"
            />
            
            <Input
              label="Max Retry Attempts"
              type="number"
              placeholder="3"
              helperText="Number of times to retry failed requests"
            />
            
            <Input
              label="Webhook URL"
              type="text"
              placeholder="https://yourapp.com/webhook"
              leftIcon={<Mail className="h-4 w-4" />}
              helperText="Optional: Receive notifications via webhook"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

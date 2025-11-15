'use client'

import React, { useState } from 'react'
import { ConfigPanel } from '@/components/ui/config-panel'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { Settings, Play, FileOutput } from 'lucide-react'

export default function ConfigPanelDemo() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [enableAuth, setEnableAuth] = useState(true)
  const [enableLogging, setEnableLogging] = useState(false)
  const [retryAttempts, setRetryAttempts] = useState('3')
  const [timeout, setTimeout] = useState('30')

  const tabs = [
    {
      id: 'config',
      label: 'Config',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-heading-s text-gray-900 dark:text-gray-100">
              API Settings
            </h3>
            
            <Input
              label="Endpoint URL"
              placeholder="https://api.example.com"
              helperText="The base URL for API requests"
              leftIcon={<Settings className="h-4 w-4" />}
            />

            <Input
              type="number"
              label="Timeout (seconds)"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              helperText="Maximum time to wait for response"
            />

            <Input
              type="number"
              label="Retry Attempts"
              value={retryAttempts}
              onChange={(e) => setRetryAttempts(e.target.value)}
              helperText="Number of retries on failure"
            />
          </div>

          <div className="space-y-4 border-t pt-4 dark:border-gray-700">
            <h3 className="text-heading-s text-gray-900 dark:text-gray-100">
              Security
            </h3>

            <Toggle
              checked={enableAuth}
              onChange={setEnableAuth}
              label="Enable Authentication"
            />

            <Toggle
              checked={enableLogging}
              onChange={setEnableLogging}
              label="Enable Request Logging"
            />
          </div>

          <div className="space-y-4 border-t pt-4 dark:border-gray-700">
            <h3 className="text-heading-s text-gray-900 dark:text-gray-100">
              Advanced
            </h3>

            <Input
              label="Custom Headers"
              placeholder='{"Authorization": "Bearer token"}'
              helperText="JSON object for custom headers"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'test',
      label: 'Test',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-heading-s mb-3 text-gray-900 dark:text-gray-100">
              Test Configuration
            </h3>
            <p className="text-body mb-4 text-gray-600 dark:text-gray-400">
              Send a test request to verify your configuration settings.
            </p>
            <Button variant="primary" leftIcon={<Play className="h-4 w-4" />}>
              Run Test
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-label text-gray-700 dark:text-gray-300">
              Test Results
            </h4>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                No tests run yet
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-body-small text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Make sure to save your configuration before running tests.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'output',
      label: 'Output',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center gap-2">
              <FileOutput className="h-5 w-5 text-primary-500" />
              <h3 className="text-heading-s text-gray-900 dark:text-gray-100">
                Output Configuration
              </h3>
            </div>
            <p className="text-body text-gray-600 dark:text-gray-400">
              Configure how the workflow node outputs data.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Output Format"
              placeholder="JSON"
              helperText="Format for output data"
            />

            <Input
              label="Output Path"
              placeholder="/output/data"
              helperText="Where to store output data"
            />

            <Toggle
              checked={true}
              onChange={() => {}}
              label="Include Metadata"
            />

            <Toggle
              checked={false}
              onChange={() => {}}
              label="Compress Output"
            />
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-body-small text-green-800 dark:text-green-200">
              Output configuration will be applied to all future executions.
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-xl mb-2 text-gray-900 dark:text-gray-100">
            Config Panel Demo
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Resizable configuration panel with tabs for workflow nodes
          </p>
        </div>

        {/* Demo Controls */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#252525]">
          <h2 className="text-heading-m mb-4 text-gray-900 dark:text-gray-100">
            Demo Controls
          </h2>
          <Button
            variant="primary"
            onClick={() => setIsPanelOpen(true)}
            leftIcon={<Settings className="h-4 w-4" />}
          >
            Open Config Panel
          </Button>
        </div>

        {/* Feature List */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#252525]">
          <h2 className="text-heading-m mb-4 text-gray-900 dark:text-gray-100">
            Features
          </h2>
          <ul className="space-y-2 text-body text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Resizable from left edge (drag the 4px border)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Min width: 300px, Max width: 50% of screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Tabbed interface with Config, Test, and Output tabs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Slide in/out animations (0.3s ease-out)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Close with X button, backdrop click, or Escape key</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Scrollable content area with 16px padding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-primary-500">•</span>
              <span>Full dark mode support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Config Panel */}
      <ConfigPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Node Configuration"
        tabs={tabs}
        defaultTab="config"
      />
    </div>
  )
}

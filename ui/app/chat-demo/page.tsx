'use client'

import { useState } from 'react'
import { ChatPanel } from '@/components/ChatPanel'
import { Button } from '@/components/ui/button'
import { MessageSquare, Workflow, Edit, Code, HelpCircle } from 'lucide-react'

type ChatContext = 'workflow_creation' | 'block_editing' | 'json_mode' | 'end_user_help'

export default function ChatDemoPage() {
  const [activeChat, setActiveChat] = useState<ChatContext | null>(null)

  const contexts: Array<{
    id: ChatContext
    title: string
    description: string
    icon: React.ReactNode
  }> = [
    {
      id: 'workflow_creation',
      title: 'Workflow Creation',
      description: 'Get help restructuring workflows, adding/removing blocks, and reordering steps',
      icon: <Workflow className="h-5 w-5" />
    },
    {
      id: 'block_editing',
      title: 'Block Editing',
      description: 'Design forms, add/modify fields and buttons with AI assistance',
      icon: <Edit className="h-5 w-5" />
    },
    {
      id: 'json_mode',
      title: 'JSON Mode',
      description: 'Fix JSON errors and improve workflow definitions',
      icon: <Code className="h-5 w-5" />
    },
    {
      id: 'end_user_help',
      title: 'End User Help',
      description: 'Help users fill out forms and complete tasks',
      icon: <HelpCircle className="h-5 w-5" />
    }
  ]

  const handleAction = (action: string, data: any) => {
    console.log('[v0] Action triggered:', action, data)
    // Handle actions from chat (e.g., updating workflow, adding fields, etc.)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1A1A]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-heading-xl mb-2 text-gray-900 dark:text-gray-100">
            Chat Panel Demo
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Context-aware AI assistant for workflow builder platform
          </p>
        </div>

        {/* Context Selection */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h2 className="text-heading-m mb-4 text-gray-900 dark:text-gray-100">
              Select a Context
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setActiveChat(context.id)}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-sm dark:border-gray-700 dark:bg-[#252525] dark:hover:border-primary-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                    {context.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-body-medium mb-1 text-gray-900 dark:text-gray-100">
                      {context.title}
                    </h3>
                    <p className="text-body-small text-gray-600 dark:text-gray-400">
                      {context.description}
                    </p>
                  </div>
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#252525]">
            <h3 className="text-heading-s mb-4 text-gray-900 dark:text-gray-100">
              Features
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Context-aware system prompts',
                'Suggested prompts per context',
                'Code syntax highlighting',
                'Copy message/code functionality',
                'Clear conversation history',
                'Loading states with animations',
                'Character count (2000 max)',
                'Keyboard shortcuts (Enter/Shift+Enter)',
                'Dark mode support',
                'Smooth slide-in animation',
                'Timestamps on messages',
                'Action callbacks for integrations'
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-body text-gray-700 dark:text-gray-300"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Mock Workflow Context */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#252525]">
            <h3 className="text-heading-s mb-2 text-gray-900 dark:text-gray-100">
              Mock Context Data
            </h3>
            <div className="space-y-2 text-body-small text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Workflow ID:</span> workflow-abc-123
              </div>
              <div>
                <span className="font-medium">Current Block ID:</span> block-form-456
              </div>
              <div>
                <span className="font-medium">API Endpoint:</span> /api/chat (mock responses active)
              </div>
            </div>
          </div>

          {/* Integration Notes */}
          <div className="mt-6 rounded-lg border border-warning-200 bg-warning-50 p-4 dark:border-warning-900/50 dark:bg-warning-900/10">
            <h3 className="text-body-medium mb-2 text-warning-800 dark:text-warning-300">
              Integration Notes
            </h3>
            <ul className="space-y-1 text-body-small text-warning-700 dark:text-warning-400">
              <li>• Replace mock API with real endpoint in ChatPanel.tsx</li>
              <li>• Implement onAction callback to handle AI suggestions</li>
              <li>• Pass real workflowId and currentBlockId props</li>
              <li>• Add authentication headers to API requests</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {activeChat && (
        <ChatPanel
          context={activeChat}
          onClose={() => setActiveChat(null)}
          onAction={handleAction}
          workflowId="workflow-abc-123"
          currentBlockId="block-form-456"
        />
      )}
    </div>
  )
}

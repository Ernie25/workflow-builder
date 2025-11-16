'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Send, Copy, Trash2, Loader2 } from 'lucide-react'

// Context types
type ChatContext = 'workflow_creation' | 'block_editing' | 'json_mode' | 'end_user_help'

// Message types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  hasCode?: boolean
}

// API Types
type ChatClassification = 'Question' | 'WorkflowManagement'

interface ChatResponse {
  classification: ChatClassification
  responseMessage: string
  workflow?: WorkflowResponse
  suggestedActions?: string[]
}

interface WorkflowResponse {
  id: string
  name: string
  description?: string
  trigger?: {
    type: string
    nodeId: string
  }
  nodes: WorkflowNodeDto[]
  connections: WorkflowConnectionDto[]
  createdAt: string
  updatedAt: string
}

interface WorkflowNodeDto {
  id: string
  type: string
  name: string
  position?: {
    x: number
    y: number
  }
  credentials?: string
  config?: Record<string, any>
  runtime?: any
  notes?: string
}

interface WorkflowConnectionDto {
  from: string
  to: string
  condition?: {
    type: string
    expression?: string
  }
}

// Props interface
export interface ChatPanelProps {
  context: ChatContext
  onClose?: () => void
  onAction?: (action: string, data: any) => void
  workflowId?: string
  currentBlockId?: string
  className?: string
}

// Context-aware configuration
const contextConfig: Record<ChatContext, {
  title: string
  systemPrompt: string
  suggestedPrompts: string[]
}> = {
  workflow_creation: {
    title: 'Workflow Assistant',
    systemPrompt: 'Help restructure workflows, add/remove blocks, reorder steps',
    suggestedPrompts: [
      'Add approval step',
      'Reorder these blocks',
      'Add conditional branching',
      'Remove duplicate steps'
    ]
  },
  block_editing: {
    title: 'Block Editor',
    systemPrompt: 'Help design forms, add/modify fields and buttons',
    suggestedPrompts: [
      'Add date field',
      'Make field required',
      'Add dropdown menu',
      'Change button style'
    ]
  },
  json_mode: {
    title: 'JSON Helper',
    systemPrompt: 'Help fix JSON errors and improve workflow definitions',
    suggestedPrompts: [
      'Fix validation error',
      'Show syntax errors',
      'Format JSON properly',
      'Validate structure'
    ]
  },
  end_user_help: {
    title: 'Help Assistant',
    systemPrompt: 'Help users fill out forms and complete tasks. DO NOT discuss design',
    suggestedPrompts: [
      'Help me fill this form',
      'What does this field mean?',
      'Why is this required?',
      'How do I submit?'
    ]
  }
}

export function ChatPanel({
  context,
  onClose,
  onAction,
  workflowId,
  currentBlockId,
  className
}: ChatPanelProps) {
  const config = contextConfig[context]
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Slide in animation on mount
  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // Call real API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          workflowId: workflowId || undefined
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const chatResponse: ChatResponse = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatResponse.responseMessage,
        timestamp: new Date(),
        hasCode: false
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle WorkflowManagement classification - replace workflow
      if (chatResponse.classification === 'WorkflowManagement' && chatResponse.workflow) {
        // Convert API workflow format to UI format
        const uiWorkflow = convertApiWorkflowToUI(chatResponse.workflow)
        
        // Trigger action callback to update workflow
        if (onAction) {
          onAction('workflow_update', {
            workflow: uiWorkflow,
            apiWorkflow: chatResponse.workflow // Include original API format
          })
        }
      } else if (onAction && chatResponse.suggestedActions && chatResponse.suggestedActions.length > 0) {
        // Handle other actions if needed
        onAction('suggested_actions', { actions: chatResponse.suggestedActions })
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  // Clear history
  const handleClearHistory = () => {
    setMessages([])
  }

  // Copy message
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const charCount = input.length
  const maxChars = 2000

  return (
    <div
      className={cn(
        'fixed right-0 top-0 z-50 flex h-full w-[350px] flex-col border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-gray-700 dark:bg-[#1A1A1A]',
        isVisible ? 'translate-x-0' : 'translate-x-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-[48px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        <h2 className="text-heading-s text-gray-900 dark:text-gray-100">
          {config.title}
        </h2>
        <button
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-body text-gray-500 dark:text-gray-400">
              {config.systemPrompt}
            </p>
            <p className="text-body-small mt-2 text-gray-400 dark:text-gray-500">
              Start a conversation or try a suggested prompt below
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={handleCopyMessage}
                isLast={index === messages.length - 1}
              />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      {messages.length === 0 && (
        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <p className="text-label mb-2 text-gray-600 dark:text-gray-400">
            Suggested prompts:
          </p>
          <div className="space-y-2">
            {config.suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-body-small w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary-600 dark:hover:bg-gray-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear History Button */}
      {messages.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <button
            onClick={handleClearHistory}
            className="text-body-small flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear history
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className={cn(
              'text-body w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-gray-900 placeholder:text-gray-400 transition-colors duration-150',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'min-h-[40px] max-h-[120px]'
            )}
            style={{
              height: 'auto',
              minHeight: '40px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || charCount > maxChars}
            className={cn(
              'absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150',
              input.trim() && !isLoading && charCount <= maxChars
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-1 flex justify-between">
          <p className="text-body-small text-gray-400 dark:text-gray-500">
            {isLoading ? 'Sending...' : 'Shift + Enter for new line'}
          </p>
          <p
            className={cn(
              'text-body-small',
              charCount > maxChars
                ? 'text-error-500'
                : 'text-gray-400 dark:text-gray-500'
            )}
          >
            {charCount}/{maxChars}
          </p>
        </div>
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({
  message,
  onCopy,
  isLast
}: {
  message: Message
  onCopy: (content: string) => void
  isLast: boolean
}) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    onCopy(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex animate-in fade-in slide-in-from-bottom-2 duration-200',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex max-w-[85%] flex-col gap-1')}>
        <div
          className={cn(
            'rounded-lg px-3 py-2',
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          )}
        >
          {message.hasCode ? (
            <CodeBlock content={message.content} />
          ) : (
            <p className="text-body whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex items-center gap-2',
            isUser ? 'justify-end' : 'justify-start'
          )}
        >
          <time className="text-[11px] text-gray-400 dark:text-gray-500">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="text-[11px] text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Copy message"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Code Block Component
function CodeBlock({ content }: { content: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="text-code overflow-x-auto rounded-md bg-gray-900 p-3 text-gray-100 dark:bg-black">
        <code>{content}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-gray-800 px-2 py-1 text-[11px] text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        aria-label="Copy code"
      >
        <Copy className="h-3 w-3" />
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

// Loading Indicator Component
function LoadingIndicator() {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 justify-start duration-200">
      <div className="flex max-w-[85%] items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
        <div className="flex gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

// Convert API WorkflowResponse format to UI format
function convertApiWorkflowToUI(apiWorkflow: WorkflowResponse): {
  id: string
  title: string
  nodes: Array<{
    id: string
    x: number
    y: number
    data: {
      title: string
      description?: string
      status: string
      nodeType: string
    }
  }>
  connections: Array<{
    id: string
    from: string
    to: string
    fromPort?: 'output' | 'true' | 'false'
    toPort?: 'input'
    label?: string
  }>
} {
  // Map API node types to UI node types
  const mapNodeType = (apiType: string): string => {
    const typeMap: Record<string, string> = {
      'trigger': 'start',
      'form': 'form',
      'action': 'action',
      'decision': 'decision',
      'end': 'end'
    }
    return typeMap[apiType.toLowerCase()] || 'action'
  }

  // Convert nodes
  const nodes = apiWorkflow.nodes.map(node => ({
    id: node.id,
    x: node.position?.x || 0,
    y: node.position?.y || 0,
    data: {
      title: node.name,
      description: node.notes || '',
      status: 'success', // Default status
      nodeType: mapNodeType(node.type)
    }
  }))

  // Convert connections
  const connections = apiWorkflow.connections.map((conn, index) => {
    let fromPort: 'output' | 'true' | 'false' = 'output'
    let label: string | undefined

    // Map condition type to fromPort
    if (conn.condition) {
      if (conn.condition.type === 'true') {
        fromPort = 'true'
        label = 'True'
      } else if (conn.condition.type === 'false') {
        fromPort = 'false'
        label = 'False'
      }
    }

    return {
      id: `conn-${conn.from}-${conn.to}-${index}`,
      from: conn.from,
      to: conn.to,
      fromPort,
      toPort: 'input' as const,
      label
    }
  })

  return {
    id: apiWorkflow.id,
    title: apiWorkflow.name,
    nodes,
    connections
  }
}

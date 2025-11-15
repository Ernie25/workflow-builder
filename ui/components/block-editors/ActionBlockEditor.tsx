'use client'

import * as React from 'react'
import { Mail, Globe, Database, Bell, Webhook, Clock, Edit, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface ActionType {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

const ACTION_TYPES: ActionType[] = [
  { id: 'email', label: 'Send Email', icon: <Mail className="w-4 h-4" />, color: 'text-primary-500' },
  { id: 'api', label: 'API Call', icon: <Globe className="w-4 h-4" />, color: 'text-info-500' },
  { id: 'database', label: 'Database Operation', icon: <Database className="w-4 h-4" />, color: 'text-success-500' },
  { id: 'notification', label: 'Send Notification', icon: <Bell className="w-4 h-4" />, color: 'text-warning-500' },
  { id: 'webhook', label: 'Webhook Trigger', icon: <Webhook className="w-4 h-4" />, color: 'text-purple-500' },
  { id: 'delay', label: 'Wait/Delay', icon: <Clock className="w-4 h-4" />, color: 'text-slate-500' },
]

interface ActionBlockEditorProps {
  blockId: string
  workflowId: string
  data: any
  onChange: (data: any) => void
  isChatOpen: boolean
  onChatToggle: (open: boolean) => void
}

export function ActionBlockEditor({ blockId, workflowId, data, onChange, isChatOpen, onChatToggle }: ActionBlockEditorProps) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = React.useState(false)
  const [selectedActionType, setSelectedActionType] = React.useState<string>(data.actionType || 'email')
  const [actionConfig, setActionConfig] = React.useState<any>(data.config || {})

  React.useEffect(() => {
    onChange({ actionType: selectedActionType, config: actionConfig })
  }, [selectedActionType, actionConfig])

  const handleConfigChange = (key: string, value: any) => {
    setActionConfig({ ...actionConfig, [key]: value })
  }

  return (
    <>
      {/* Left Sidebar */}
      <div 
        className={cn(
          "transition-all duration-300 border-r border-slate-200 bg-white overflow-y-auto",
          isLeftSidebarCollapsed ? "w-0" : "w-72"
        )}
      >
        {!isLeftSidebarCollapsed && (
          <div className="px-4 py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Action Types</h3>
            <p className="text-sm text-slate-600 mb-4">Choose an action</p>
            
            <div className="space-y-2">
              {ACTION_TYPES.map((actionType) => (
                <button
                  key={actionType.id}
                  onClick={() => setSelectedActionType(actionType.id)}
                  className={cn(
                    "flex w-full items-center gap-3 bg-white border rounded-lg p-3 transition-all hover:bg-slate-50 hover:shadow-sm",
                    selectedActionType === actionType.id ? "border-primary-500 bg-primary-50" : "border-slate-200"
                  )}
                >
                  <div className={cn("flex-shrink-0", actionType.color)}>
                    {actionType.icon}
                  </div>
                  <span className="text-body text-slate-900">{actionType.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        className="absolute left-0 top-[50%] translate-y-[-50%] z-30 bg-white border border-slate-200 rounded-r-md p-1 hover:bg-slate-50 transition-all shadow-sm"
        style={{ left: isLeftSidebarCollapsed ? '0' : '288px' }}
      >
        {isLeftSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          isChatOpen && "mr-[350px]"
        )}
      >
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <h2 className="text-heading-m text-slate-900 mb-6">
            {ACTION_TYPES.find(t => t.id === selectedActionType)?.label}
          </h2>

          {selectedActionType === 'email' && (
            <EmailActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
          {selectedActionType === 'api' && (
            <ApiActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
          {selectedActionType === 'database' && (
            <DatabaseActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
          {selectedActionType === 'notification' && (
            <NotificationActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
          {selectedActionType === 'webhook' && (
            <WebhookActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
          {selectedActionType === 'delay' && (
            <DelayActionConfig config={actionConfig} onChange={handleConfigChange} />
          )}
        </div>
      </div>

      {/* AI Assistant Button */}
      {!isChatOpen && (
        <button
          onClick={() => onChatToggle(true)}
          className={cn(
            'fixed bottom-4 z-40 flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-white shadow-lg transition-all duration-300',
            'hover:bg-primary-600 hover:shadow-xl right-20'
          )}
        >
          <span className="text-body-small font-medium">Open AI Assistant</span>
        </button>
      )}
    </>
  )
}

// Email Action Configuration
function EmailActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <Input
        label="To (Email Address)"
        value={config.to || ''}
        onChange={(e) => onChange('to', e.target.value)}
        placeholder="recipient@example.com"
      />
      <Input
        label="Subject"
        value={config.subject || ''}
        onChange={(e) => onChange('subject', e.target.value)}
        placeholder="Email subject"
      />
      <div>
        <label className="text-label mb-2 block text-slate-900">Body</label>
        <textarea
          value={config.body || ''}
          onChange={(e) => onChange('body', e.target.value)}
          className="w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-body"
          placeholder="Email body content..."
        />
      </div>
    </div>
  )
}

// API Action Configuration
function ApiActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-label mb-2 block text-slate-900">Method</label>
        <select
          value={config.method || 'GET'}
          onChange={(e) => onChange('method', e.target.value)}
          className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
      <Input
        label="URL"
        value={config.url || ''}
        onChange={(e) => onChange('url', e.target.value)}
        placeholder="https://api.example.com/endpoint"
      />
      <div>
        <label className="text-label mb-2 block text-slate-900">Headers (JSON)</label>
        <textarea
          value={config.headers || ''}
          onChange={(e) => onChange('headers', e.target.value)}
          className="w-full min-h-[80px] rounded-md border border-slate-200 px-3 py-2 text-body font-mono text-sm"
          placeholder='{"Content-Type": "application/json"}'
        />
      </div>
      <div>
        <label className="text-label mb-2 block text-slate-900">Body (JSON)</label>
        <textarea
          value={config.body || ''}
          onChange={(e) => onChange('body', e.target.value)}
          className="w-full min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-body font-mono text-sm"
          placeholder='{"key": "value"}'
        />
      </div>
    </div>
  )
}

// Database Action Configuration
function DatabaseActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-label mb-2 block text-slate-900">Operation</label>
        <select
          value={config.operation || 'insert'}
          onChange={(e) => onChange('operation', e.target.value)}
          className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
        >
          <option value="insert">Insert</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="select">Select</option>
        </select>
      </div>
      <Input
        label="Table Name"
        value={config.table || ''}
        onChange={(e) => onChange('table', e.target.value)}
        placeholder="users"
      />
      <div>
        <label className="text-label mb-2 block text-slate-900">Query/Data (JSON)</label>
        <textarea
          value={config.data || ''}
          onChange={(e) => onChange('data', e.target.value)}
          className="w-full min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-body font-mono text-sm"
          placeholder='{"name": "John", "email": "john@example.com"}'
        />
      </div>
    </div>
  )
}

// Notification Action Configuration
function NotificationActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-label mb-2 block text-slate-900">Type</label>
        <select
          value={config.type || 'push'}
          onChange={(e) => onChange('type', e.target.value)}
          className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
        >
          <option value="push">Push Notification</option>
          <option value="sms">SMS</option>
          <option value="slack">Slack</option>
        </select>
      </div>
      <Input
        label="Recipients"
        value={config.recipients || ''}
        onChange={(e) => onChange('recipients', e.target.value)}
        placeholder="user@example.com or +1234567890"
      />
      <Input
        label="Message"
        value={config.message || ''}
        onChange={(e) => onChange('message', e.target.value)}
        placeholder="Notification message"
      />
    </div>
  )
}

// Webhook Action Configuration
function WebhookActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <Input
        label="Webhook URL"
        value={config.url || ''}
        onChange={(e) => onChange('url', e.target.value)}
        placeholder="https://hooks.example.com/webhook"
      />
      <div>
        <label className="text-label mb-2 block text-slate-900">Payload (JSON)</label>
        <textarea
          value={config.payload || ''}
          onChange={(e) => onChange('payload', e.target.value)}
          className="w-full min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-body font-mono text-sm"
          placeholder='{"event": "workflow_completed"}'
        />
      </div>
    </div>
  )
}

// Delay Action Configuration
function DelayActionConfig({ config, onChange }: { config: any, onChange: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <Input
        label="Duration"
        type="number"
        value={config.duration || ''}
        onChange={(e) => onChange('duration', e.target.value)}
        placeholder="5"
      />
      <div>
        <label className="text-label mb-2 block text-slate-900">Unit</label>
        <select
          value={config.unit || 'seconds'}
          onChange={(e) => onChange('unit', e.target.value)}
          className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
    </div>
  )
}

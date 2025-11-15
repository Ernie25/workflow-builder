'use client'

import { useState } from 'react'
import { WorkflowNode } from '@/components/ui/workflow-node'
import { Zap, Mail, Database, FileText, MessageSquare, GitBranch, Clock, Server } from 'lucide-react'

export default function WorkflowDemo() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState([
    {
      id: '1',
      title: 'HTTP Trigger',
      icon: <Zap className="w-6 h-6 text-primary-500" />,
      description: 'Starts when an HTTP request is received',
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Send Email',
      icon: <Mail className="w-6 h-6 text-blue-500" />,
      description: 'Send an email notification to users',
      status: 'running' as const,
    },
    {
      id: '3',
      title: 'Database Query',
      icon: <Database className="w-6 h-6 text-purple-500" />,
      description: 'Fetch data from PostgreSQL database',
      status: 'pending' as const,
    },
    {
      id: '4',
      title: 'Generate Report',
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      description: 'Create PDF report from template',
    },
    {
      id: '5',
      title: 'Conditional Branch',
      icon: <GitBranch className="w-6 h-6 text-teal-500" />,
      description: 'Split workflow based on conditions',
      status: 'error' as const,
    },
    {
      id: '6',
      title: 'Delay',
      icon: <Clock className="w-6 h-6 text-gray-500" />,
      description: 'Wait for 5 minutes before continuing',
    },
    {
      id: '7',
      title: 'Webhook',
      icon: <MessageSquare className="w-6 h-6 text-green-500" />,
      description: 'Send data to external webhook URL',
      status: 'warning' as const,
    },
    {
      id: '8',
      title: 'API Request',
      icon: <Server className="w-6 h-6 text-indigo-500" />,
      description: 'Make HTTP request to external API',
    },
  ])

  const handleDelete = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id))
    if (selectedNode === id) {
      setSelectedNode(null)
    }
  }

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', id)
    console.log('[v0] Drag started for node:', id)
  }

  const handlePortClick = (nodeId: string, type: 'input' | 'output') => {
    console.log('[v0] Port clicked:', { nodeId, type })
  }

  const handleEdit = (id: string) => {
    console.log('[v0] Edit node:', id)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1A1A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-xl text-gray-900 dark:text-gray-100 mb-2">
            Workflow Node Component
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Draggable workflow nodes for canvas builder with states, ports, and interactions
          </p>
        </div>

        {/* Canvas Area */}
        <div className="bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 min-h-[600px] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />
          
          <div className="relative grid grid-cols-4 gap-6">
            {nodes.map((node) => (
              <div key={node.id} onClick={() => setSelectedNode(node.id)}>
                <WorkflowNode
                  id={node.id}
                  title={node.title}
                  icon={node.icon}
                  description={node.description}
                  status={node.status}
                  selected={selectedNode === node.id}
                  onDragStart={handleDragStart(node.id)}
                  onPortClick={(type) => handlePortClick(node.id, type)}
                  onDelete={() => handleDelete(node.id)}
                  onEdit={() => handleEdit(node.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* States Examples */}
        <div className="space-y-8">
          <div>
            <h2 className="text-heading-m text-gray-900 dark:text-gray-100 mb-4">
              Node States
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-label text-gray-600 dark:text-gray-400 mb-2">Default</p>
                <WorkflowNode
                  id="demo-1"
                  title="Default State"
                  icon={<Zap className="w-6 h-6 text-primary-500" />}
                  description="Normal node appearance"
                />
              </div>
              <div>
                <p className="text-label text-gray-600 dark:text-gray-400 mb-2">Selected</p>
                <WorkflowNode
                  id="demo-2"
                  title="Selected State"
                  icon={<Mail className="w-6 h-6 text-blue-500" />}
                  description="Node is currently selected"
                  selected
                />
              </div>
              <div>
                <p className="text-label text-gray-600 dark:text-gray-400 mb-2">With Status</p>
                <WorkflowNode
                  id="demo-3"
                  title="Running Task"
                  icon={<Database className="w-6 h-6 text-purple-500" />}
                  description="Node with running status"
                  status="running"
                />
              </div>
              <div>
                <p className="text-label text-gray-600 dark:text-gray-400 mb-2">Error State</p>
                <WorkflowNode
                  id="demo-4"
                  title="Failed Step"
                  icon={<FileText className="w-6 h-6 text-orange-500" />}
                  description="Node with error status"
                  status="error"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-heading-s text-blue-900 dark:text-blue-100 mb-2">
              Interaction Guide
            </h3>
            <ul className="text-body-small text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Click a node to select it (shows brand color border with glow)</li>
              <li>• Hover to see action buttons (Execute and Delete)</li>
              <li>• Double-click to edit a node</li>
              <li>• Right-click for context menu</li>
              <li>• Drag nodes to reposition them on the canvas</li>
              <li>• Click input/output ports (circles on sides) to create connections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

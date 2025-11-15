'use client'

import { useState } from 'react'
import { WorkflowCanvas, type Node, type Connection } from '@/components/ui/workflow-canvas'
import { WorkflowNode } from '@/components/ui/workflow-node'
import { Database, Mail, Code, Webhook, Filter } from 'lucide-react'

export default function CanvasDemoPage() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      x: 100,
      y: 100,
      data: {
        title: 'Data Source',
        icon: <Database className="w-5 h-5 text-primary-600" />,
        description: 'Fetch data from database',
        status: 'success',
      },
    },
    {
      id: '2',
      x: 400,
      y: 100,
      data: {
        title: 'Filter',
        icon: <Filter className="w-5 h-5 text-secondary-600" />,
        description: 'Filter records by criteria',
        status: 'running',
      },
    },
    {
      id: '3',
      x: 700,
      y: 50,
      data: {
        title: 'Send Email',
        icon: <Mail className="w-5 h-5 text-info-500" />,
        description: 'Send notification email',
        status: 'pending',
      },
    },
    {
      id: '4',
      x: 700,
      y: 200,
      data: {
        title: 'Webhook',
        icon: <Webhook className="w-5 h-5 text-warning-500" />,
        description: 'Trigger external webhook',
        status: 'pending',
      },
    },
    {
      id: '5',
      x: 400,
      y: 300,
      data: {
        title: 'Transform',
        icon: <Code className="w-5 h-5 text-success-500" />,
        description: 'Transform data structure',
        status: 'success',
      },
    },
  ])

  const [connections] = useState<Connection[]>([
    { id: 'c1', from: '1', to: '2' },
    { id: 'c2', from: '2', to: '3' },
    { id: 'c3', from: '2', to: '4' },
    { id: 'c4', from: '1', to: '5' },
  ])

  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())

  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node
      )
    )
  }

  const handleNodeSelect = (nodeId: string, multi: boolean) => {
    setSelectedNodes((prev) => {
      const newSet = new Set(prev)
      if (multi) {
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId)
        } else {
          newSet.add(nodeId)
        }
      } else {
        return new Set([nodeId])
      }
      return newSet
    })
  }

  const handleNodeDelete = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setSelectedNodes((prev) => {
      const newSet = new Set(prev)
      newSet.delete(nodeId)
      return newSet
    })
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525]">
        <div className="px-6 py-4">
          <h1 className="text-heading-l text-gray-900 dark:text-gray-100">
            Workflow Canvas Demo
          </h1>
          <p className="text-body-small text-gray-600 dark:text-gray-400 mt-1">
            Drag nodes, zoom, pan, and connect workflow steps
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          onNodeMove={handleNodeMove}
          onNodeSelect={handleNodeSelect}
        >
          {nodes.map((node) => (
            <WorkflowNode
              key={node.id}
              id={node.id}
              title={node.data.title}
              icon={node.data.icon}
              description={node.data.description}
              status={node.data.status}
              selected={selectedNodes.has(node.id)}
              onDelete={() => handleNodeDelete(node.id)}
            />
          ))}
        </WorkflowCanvas>
      </div>

      {/* Info Panel */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525]">
        <div className="px-6 py-3">
          <div className="flex items-center gap-6 text-body-small text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Nodes:</span> {nodes.length}
            </div>
            <div>
              <span className="font-medium">Connections:</span> {connections.length}
            </div>
            <div>
              <span className="font-medium">Selected:</span> {selectedNodes.size}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

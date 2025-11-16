'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, ChevronLeft, ChevronRight, Webhook, Square, GitBranch, FileText, Box, Code, Maximize, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowCanvas, type Node, type Connection } from '@/components/ui/workflow-canvas'
import { WorkflowNode } from '@/components/ui/workflow-node'
import { ChatPanel } from '@/components/ChatPanel'
import { JSONEditor } from '@/components/JSONEditor'
import { cn } from '@/lib/utils'

interface BlockType {
  type: 'trigger' | 'form' | 'action' | 'decision'
  label: string
  icon: React.ReactNode
  color: string
}

const BLOCK_TYPES: BlockType[] = [
  {
    type: 'trigger',
    label: 'Trigger / Webhook',
    icon: <Webhook className="w-4 h-4" />,
    color: 'text-purple-500'
  },
  {
    type: 'action',
    label: 'Action',
    icon: <Square className="w-4 h-4" />,
    color: 'text-info-500'
  },
  {
    type: 'form',
    label: 'Form',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-primary-500'
  },
  {
    type: 'decision',
    label: 'Decision / Conditional',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-warning-500'
  }
]

export interface Connection {
  id: string
  from: string
  to: string
  fromPort?: 'output' | 'true' | 'false'
  toPort?: 'input'
  label?: string
}

function getIconForNodeType(nodeType: string, color: string) {
  switch (nodeType) {
    case 'trigger':
      return <Webhook className={cn("w-4 h-4", color)} />
    case 'form':
      return <FileText className={cn("w-4 h-4", color)} />
    case 'action':
      return <Square className={cn("w-4 h-4", color)} />
    case 'decision':
      return <GitBranch className={cn("w-4 h-4", color)} />
    default:
      return <Square className={cn("w-4 h-4", color)} />
  }
}

export default function WorkflowBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  // State
  const [workflowTitle, setWorkflowTitle] = useState('Untitled Workflow')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [entrypointNodeId, setEntrypointNodeId] = useState<string | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const isDropProcessingRef = useRef(false)
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual')
  const [jsonData, setJsonData] = useState<any>({})
  const jsonEditorRef = useRef<{ format: () => void; validate: () => void } | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load workflow data on mount
  useEffect(() => {
    // Load from localStorage or use default
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    
    if (savedWorkflow) {
      const data = JSON.parse(savedWorkflow)
      setWorkflowTitle(data.name || 'Untitled Workflow')
      setEntrypointNodeId(data.trigger?.nodeId || null)
      
      const nodesWithIcons = (data.nodes || []).map((node: any) => {
        const nodeType = node.type || 'action'
        const blockType = BLOCK_TYPES.find(b => b.type === nodeType)
        const color = blockType?.color || 'text-gray-500'
        
        const convertedNode: Node = {
          id: node.id,
          type: nodeType,
          name: node.name || 'Untitled',
          position: node.position || { x: 0, y: 0 },
          data: {
            ...node.data,
            icon: getIconForNodeType(nodeType, color),
            description: node.description || node.data?.description,
            status: node.data?.status
          }
        }
        
        return convertedNode
      })
      
      setNodes(nodesWithIcons)
      setConnections(data.connections || [])
    } else {
      setNodes([])
      setConnections([])
      setWorkflowTitle('Untitled Workflow')
      setEntrypointNodeId(null)
    }
  }, [workflowId])

  useEffect(() => {
    if (nodes.length === 0) return
    
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      const nodesToSave = nodes.map(node => {
        const { icon, ...dataWithoutIcon } = node.data || {}
        return {
          id: node.id,
          type: node.type,
          name: node.name,
          position: node.position,
          data: dataWithoutIcon,
          description: node.data?.description
        }
      })
      
      const workflowData = {
        id: workflowId,
        name: workflowTitle,
        title: workflowTitle,
        trigger: {
          type: 'manual',
          nodeId: entrypointNodeId || ''
        },
        nodes: nodesToSave,
        connections,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflowData))
      console.log('[v0] Auto-saved workflow with', nodes.length, 'nodes')
    }, 1000)
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [nodes, connections, workflowId, workflowTitle, entrypointNodeId])

  const handleSave = useCallback(() => {
    setIsSaving(true)
    
    const nodesToSave = nodes.map(node => {
      const { icon, ...dataWithoutIcon } = node.data || {}
      return {
        id: node.id,
        type: node.type,
        name: node.name,
        position: node.position,
        data: dataWithoutIcon,
        description: node.data?.description
      }
    })
    
    const workflowData = {
      id: workflowId,
      name: workflowTitle,
      title: workflowTitle,
      trigger: {
        type: 'manual',
        nodeId: entrypointNodeId || ''
      },
      nodes: nodesToSave,
      connections,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflowData))
    
    const allWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]')
    const workflowIndex = allWorkflows.findIndex((w: any) => w.id === workflowId)
    
    if (workflowIndex !== -1) {
      allWorkflows[workflowIndex] = {
        ...allWorkflows[workflowIndex],
        name: workflowTitle,
        description: `${nodes.length} blocks, ${connections.length} connections`,
        updatedAt: new Date().toISOString()
      }
    } else {
      allWorkflows.push({
        id: workflowId,
        name: workflowTitle,
        description: `${nodes.length} blocks, ${connections.length} connections`,
        status: 'draft',
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    localStorage.setItem('workflows', JSON.stringify(allWorkflows))
    
    setTimeout(() => {
      setIsSaving(false)
      alert('Workflow saved successfully!')
    }, 500)
  }, [workflowId, workflowTitle, nodes, connections, entrypointNodeId])

  const handlePublish = useCallback(() => {
    const nodesToSave = nodes.map(node => {
      const { icon, ...dataWithoutIcon } = node.data || {}
      return {
        id: node.id,
        type: node.type,
        name: node.name,
        position: node.position,
        data: dataWithoutIcon,
        description: node.data?.description
      }
    })
    
    const workflowData = {
      id: workflowId,
      name: workflowTitle,
      title: workflowTitle,
      trigger: {
        type: 'manual',
        nodeId: entrypointNodeId || ''
      },
      nodes: nodesToSave,
      connections,
      isPublished: true,
      publishedAt: new Date().toISOString()
    }
    localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflowData))
    
    const allWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]')
    const index = allWorkflows.findIndex((w: any) => w.id === workflowId)
    if (index !== -1) {
      allWorkflows[index].isPublished = true
      allWorkflows[index].status = 'published'
      localStorage.setItem('workflows', JSON.stringify(allWorkflows))
    }
    
    alert('Workflow published successfully!')
  }, [workflowId, workflowTitle, nodes, connections, entrypointNodeId])

  const handleNodeMove = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position: { x, y } } : node
    ))
  }, [])

  const handleNodeSelect = useCallback((nodeId: string, multi: boolean) => {
    setSelectedNodeId(nodeId)
  }, [])

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ))
  }, [])

  const handleNodesDelete = useCallback((nodeIds: string[]) => {
    setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)))
    setConnections(prev => prev.filter(conn => 
      !nodeIds.includes(conn.from) && !nodeIds.includes(conn.to)
    ))
  }, [])

  const handleNodeEdit = useCallback((nodeId: string) => {
    router.push(`/workflow/${workflowId}/block/${nodeId}`)
  }, [workflowId, router])

  const handleBlockDragStart = (blockType: BlockType, e: React.DragEvent) => {
    setDraggedBlockType(blockType)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', blockType.type)
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDropProcessingRef.current || !draggedBlockType) {
      return
    }

    isDropProcessingRef.current = true

    const canvasRect = e.currentTarget.getBoundingClientRect()
    const scrollLeft = e.currentTarget.scrollLeft || 0
    const scrollTop = e.currentTarget.scrollTop || 0
    
    const x = e.clientX - canvasRect.left + scrollLeft - 100
    const y = e.clientY - canvasRect.top + scrollTop - 75

    let iconColor = 'text-gray-500'
    let statusColor: 'success' | 'error' | 'warning' | 'pending' | 'running' = 'pending'
    
    switch (draggedBlockType.type) {
      case 'trigger':
        iconColor = 'text-purple-500'
        statusColor = 'pending'
        break
      case 'form':
        iconColor = 'text-primary-500'
        statusColor = 'running'
        break
      case 'action':
        iconColor = 'text-info-500'
        statusColor = 'running'
        break
      case 'decision':
        iconColor = 'text-warning-500'
        statusColor = 'warning'
        break
    }

    const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newNode: Node = {
      id: nodeId,
      type: draggedBlockType.type,
      name: draggedBlockType.label,
      position: { x, y },
      data: {
        icon: getIconForNodeType(draggedBlockType.type, iconColor),
        description: `New ${draggedBlockType.label.toLowerCase()} block`,
        status: statusColor
      }
    }

    setNodes(prev => [...prev, newNode])
    setDraggedBlockType(null)
    
    setTimeout(() => {
      isDropProcessingRef.current = false
    }, 200)
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleBlockDragEnd = () => {
    setDraggedBlockType(null)
    setTimeout(() => {
      isDropProcessingRef.current = false
    }, 100)
  }

  const handlePortClick = useCallback((nodeId: string, type: 'input' | 'output', port?: string) => {
    console.log('[v0] handlePortClick called:', { nodeId, type, port, connectingFrom })
    
    if (nodeId === '' && type === 'input') {
      console.log('[v0] Connection cancelled via ESC')
      setConnectingFrom(null)
      return
    }
    
    if (type === 'input' && nodeId === entrypointNodeId) {
      console.log('[v0] Cannot connect to entrypoint node input')
      setConnectingFrom(null)
      return
    }
    
    if (type === 'output') {
      console.log('[v0] Starting connection from:', nodeId, 'port:', port || 'default')
      setConnectingFrom(port ? `${nodeId}:${port}` : nodeId)
    } else if (type === 'input') {
      if (connectingFrom && !connectingFrom.startsWith(nodeId)) {
        const [fromNodeId, fromPort] = connectingFrom.split(':')
        
        console.log('[v0] Completing connection from', fromNodeId, 'port', fromPort, 'to', nodeId)
        
        let label = undefined
        if (fromPort === 'true') {
          label = 'True'
        } else if (fromPort === 'false') {
          label = 'False'
        }
        
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: fromNodeId,
          to: nodeId,
          fromPort: (fromPort as 'output' | 'true' | 'false') || 'output',
          toPort: 'input',
          label
        }
        setConnections(prev => [...prev, newConnection])
        setConnectingFrom(null)
      } else if (connectingFrom?.startsWith(nodeId)) {
        console.log('[v0] Cancelled - same node')
        setConnectingFrom(null)
      }
    }
  }, [connectingFrom, entrypointNodeId])

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
  }, [])

  useEffect(() => {
    if (viewMode === 'json') {
      const workflowJSON = {
        id: workflowId,
        name: workflowTitle,
        description: null,
        trigger: {
          type: 'manual',
          nodeId: entrypointNodeId || ''
        },
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          name: node.name,
          position: node.position
        })),
        connections: connections.map(conn => ({
          from: conn.from,
          to: conn.to,
          condition: conn.fromPort && conn.fromPort !== 'output' ? {
            type: conn.fromPort,
            expression: null
          } : null
        })),
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setJsonData(workflowJSON)
    }
  }, [viewMode, nodes, connections, workflowId, workflowTitle, entrypointNodeId])

  const handleJSONChange = useCallback((newData: any) => {
    setJsonData(newData)
    
    if (newData.name) setWorkflowTitle(newData.name)
    if (newData.trigger?.nodeId) setEntrypointNodeId(newData.trigger.nodeId)
    if (newData.nodes) {
      const nodesWithIcons = newData.nodes.map((node: any) => {
        const nodeType = node.type || 'action'
        const blockType = BLOCK_TYPES.find(b => b.type === nodeType)
        const color = blockType?.color || 'text-gray-500'
        
        return {
          id: node.id,
          type: nodeType,
          name: node.name,
          position: node.position || { x: 0, y: 0 },
          data: {
            ...node.data,
            icon: getIconForNodeType(nodeType, color),
            description: node.description || node.data?.description,
            status: node.status
          }
        }
      })
      setNodes(nodesWithIcons)
    }
    if (newData.connections) {
      const convertedConnections = newData.connections.map((conn: any) => ({
        id: `conn-${conn.from}-${conn.to}`,
        from: conn.from,
        to: conn.to,
        fromPort: conn.condition?.type || 'output',
        toPort: 'input',
        label: conn.condition?.type === 'true' ? 'True' : conn.condition?.type === 'false' ? 'False' : undefined
      }))
      setConnections(convertedConnections)
    }
  }, [])

  const handleFormatJSON = useCallback(() => {
    const formatted = {
      id: workflowId,
      name: workflowTitle,
      description: null,
      trigger: {
        type: 'manual',
        nodeId: entrypointNodeId || ''
      },
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        name: node.name,
        position: node.position
      })),
      connections: connections.map(conn => ({
        from: conn.from,
        to: conn.to,
        condition: conn.fromPort && conn.fromPort !== 'output' ? {
          type: conn.fromPort,
          expression: null
        } : null
      })),
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setJsonData(formatted)
  }, [workflowId, workflowTitle, nodes, connections, entrypointNodeId])

  const handleValidateJSON = useCallback(() => {
    try {
      JSON.parse(JSON.stringify(jsonData))
      return { valid: true }
    } catch (err: any) {
      return { valid: false, error: err.message }
    }
  }, [jsonData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault()
        handleNodeDelete(selectedNodeId)
      }
      
      if (e.key === 'Escape' && connectingFrom) {
        setConnectingFrom(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, connectingFrom])

  const formNodes = nodes.filter(node => node.type === 'form')

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-[#1A1A1A]">
      <div className="flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-[#252525]">
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/')}
          >
            Back
          </Button>
          <input
            type="text"
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            className={cn(
              'text-heading-m border-none bg-transparent text-gray-900 outline-none dark:text-gray-100',
              'focus:underline'
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1 dark:border-gray-700">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'flex items-center gap-1.5 rounded px-3 py-1.5 text-body-small transition-colors',
                viewMode === 'visual'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              <Box className="h-3.5 w-3.5" />
              Visual
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={cn(
                'flex items-center gap-1.5 rounded px-3 py-1.5 text-body-small transition-colors',
                viewMode === 'json'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              <Code className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublish}>
            <Upload className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'relative border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-[#252525]',
            isSidebarOpen ? 'w-[250px]' : 'w-0'
          )}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              'absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-[#252525]',
              'hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {isSidebarOpen && (
            <div className="flex h-full flex-col p-4">
              {viewMode === 'visual' ? (
                <>
                  <h3 className="text-heading-s mb-4 text-gray-900 dark:text-gray-100">
                    Add Blocks
                  </h3>
                  <div className="space-y-2">
                    {BLOCK_TYPES.map((blockType) => (
                      <div
                        key={blockType.type}
                        draggable
                        onDragStart={(e) => handleBlockDragStart(blockType, e)}
                        onDragEnd={handleBlockDragEnd}
                        className={cn(
                          'flex cursor-grab items-center gap-3 rounded-md border border-gray-200 bg-white p-3 transition-all duration-150',
                          'hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm',
                          'active:cursor-grabbing active:scale-95',
                          'dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-600 dark:hover:bg-gray-700'
                        )}
                      >
                        <div className={cn('flex-shrink-0', blockType.color)}>
                          {blockType.icon}
                        </div>
                        <span className="text-body text-gray-900 dark:text-gray-100">
                          {blockType.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2">
                    <h3 className="text-heading-s text-gray-900 dark:text-gray-100">
                      Entrypoint
                    </h3>
                    <select
                      value={entrypointNodeId || ''}
                      onChange={(e) => setEntrypointNodeId(e.target.value || null)}
                      className={cn(
                        'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-body',
                        'text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700',
                        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      disabled={formNodes.length === 0}
                    >
                      <option value="">No entrypoint</option>
                      {formNodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-body-small text-gray-600 dark:text-gray-400">
                      {formNodes.length === 0
                        ? 'Add a form node to set an entrypoint'
                        : 'Select which form node is the entrypoint'}
                    </p>
                  </div>

                  <div className="mt-6 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-body-small text-gray-600 dark:text-gray-400">
                      Drag blocks onto the canvas. Click output ports (right) then input ports (left) to connect blocks.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-heading-s mb-4 text-gray-900 dark:text-gray-100">
                    JSON Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleFormatJSON}
                      className="w-full justify-start"
                    >
                      <Maximize className="h-4 w-4" />
                      Format
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleValidateJSON}
                      className="w-full justify-start"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Validate
                    </Button>
                  </div>

                  <div className="mt-6 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-body-small text-gray-600 dark:text-gray-400">
                      Edit the workflow structure as JSON. Changes are applied in real-time.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {viewMode === 'visual' ? (
          <div 
            ref={canvasContainerRef}
            className="flex-1 overflow-auto relative"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <WorkflowCanvas
              nodes={nodes}
              connections={connections}
              onNodeMove={handleNodeMove}
              onNodeSelect={handleNodeSelect}
              onConnect={handlePortClick}
              onConnectionDelete={handleConnectionDelete}
              connectingFrom={connectingFrom}
              onNodeDelete={handleNodesDelete}
              isChatOpen={isChatOpen}
              entrypointNodeId={entrypointNodeId}
            >
              {nodes.map((node) => (
                <WorkflowNode
                  key={node.id}
                  id={node.id}
                  name={node.name}
                  icon={node.data?.icon}
                  description={node.data?.description}
                  status={node.data?.status}
                  selected={selectedNodeId === node.id}
                  onDelete={() => handleNodeDelete(node.id)}
                  onEdit={() => handleNodeEdit(node.id)}
                  onPortClick={(type, port) => handlePortClick(node.id, type, port)}
                  isConnecting={connectingFrom?.startsWith(node.id)}
                  nodeType={node.type as any}
                  isEntrypoint={node.id === entrypointNodeId}
                />
              ))}
            </WorkflowCanvas>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <JSONEditor
              data={jsonData}
              onChange={handleJSONChange}
              onFormat={handleFormatJSON}
              onValidate={handleValidateJSON}
            />
          </div>
        )}

        {isChatOpen && (
          <ChatPanel
            context="workflow_creation"
            workflowId={workflowId}
            onClose={() => setIsChatOpen(false)}
            onAction={(action, data) => {
              console.log('[v0] Chat action:', action, data)
            }}
          />
        )}
      </div>

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={cn(
            'fixed bottom-4 right-20 z-40 flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-white shadow-lg transition-all duration-150',
            'hover:bg-primary-600 hover:shadow-xl'
          )}
        >
          <span className="text-body-small font-medium">Open AI Assistant</span>
        </button>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, ChevronLeft, ChevronRight, Play, Square, GitBranch, Flag, FileText, Box, Code, Maximize, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowCanvas, type Node, type Connection } from '@/components/ui/workflow-canvas'
import { WorkflowNode } from '@/components/ui/workflow-node'
import { ChatPanel } from '@/components/ChatPanel'
import { JSONEditor } from '@/components/JSONEditor'
import { cn } from '@/lib/utils'

// Block type definitions
interface BlockType {
  type: 'start' | 'form' | 'action' | 'decision' | 'end'
  label: string
  icon: React.ReactNode
  color: string
}

const BLOCK_TYPES: BlockType[] = [
  {
    type: 'start',
    label: 'Start',
    icon: <Play className="w-4 h-4" />,
    color: 'text-success-500'
  },
  {
    type: 'form',
    label: 'Form',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-primary-500'
  },
  {
    type: 'action',
    label: 'Action',
    icon: <Square className="w-4 h-4" />,
    color: 'text-info-500'
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-warning-500'
  },
  {
    type: 'end',
    label: 'End',
    icon: <Flag className="w-4 h-4" />,
    color: 'text-error-500'
  }
]

export interface Connection {
  id: string
  from: string
  to: string
  fromPort?: 'output' | 'true' | 'false' // Added true/false for decision branches
  toPort?: 'input'
  label?: string // Added label for decision branches
}

function getIconForNodeType(nodeType: string, color: string) {
  switch (nodeType) {
    case 'start':
      return <Play className={cn("w-4 h-4", color)} />
    case 'form':
      return <FileText className={cn("w-4 h-4", color)} />
    case 'action':
      return <Square className={cn("w-4 h-4", color)} />
    case 'decision':
      return <GitBranch className={cn("w-4 h-4", color)} />
    case 'end':
      return <Flag className={cn("w-4 h-4", color)} />
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
      setWorkflowTitle(data.title || 'Untitled Workflow')
      
      const nodesWithIcons = (data.nodes || []).map((node: any) => {
        const nodeType = node.data.nodeType || 'action'
        const blockType = BLOCK_TYPES.find(b => b.type === nodeType)
        const color = blockType?.color || 'text-gray-500'
        
        return {
          ...node,
          data: {
            ...node.data,
            icon: getIconForNodeType(nodeType, color)
          }
        }
      })
      
      setNodes(nodesWithIcons)
      setConnections(data.connections || [])
    } else {
      const startNode: Node[] = [
        {
          id: 'node-1',
          x: 350,
          y: 300,
          data: {
            title: 'Start',
            icon: <Play className="w-4 h-4 text-success-500" />,
            description: 'New start block',
            status: 'success',
            nodeType: 'start'
          }
        }
      ]

      setNodes(startNode)
      setConnections([])
      setWorkflowTitle('Untitled Workflow')
    }
  }, [workflowId])

  useEffect(() => {
    if (nodes.length === 0) return
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    
    // Set new timer to save after 1 second of inactivity
    autoSaveTimerRef.current = setTimeout(() => {
      const nodesToSave = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          icon: undefined // Don't save React elements
        }
      }))
      
      const workflowData = {
        id: workflowId,
        title: workflowTitle,
        nodes: nodesToSave,
        connections,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflowData))
      console.log('[v0] Auto-saved workflow with', nodes.length, 'nodes')
    }, 1000) // Wait 1 second after last change
    
    // Cleanup timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [nodes, connections, workflowId, workflowTitle])

  // Save workflow
  const handleSave = useCallback(() => {
    setIsSaving(true)
    
    const nodesToSave = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        icon: undefined
      }
    }))
    
    const workflowData = {
      id: workflowId,
      title: workflowTitle,
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
  }, [workflowId, workflowTitle, nodes, connections])

  // Publish workflow
  const handlePublish = useCallback(() => {
    const nodesToSave = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        icon: undefined
      }
    }))
    
    const workflowData = {
      id: workflowId,
      title: workflowTitle,
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
  }, [workflowId, workflowTitle, nodes, connections])

  // Handle node move
  const handleNodeMove = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ))
  }, [])

  // Handle node select
  const handleNodeSelect = useCallback((nodeId: string, multi: boolean) => {
    setSelectedNodeId(nodeId)
  }, [])

  // Handle node delete
  const handleNodeDelete = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(node => node.id === nodeId)
    if (nodeToDelete?.data.title === 'Start') {
      alert('Cannot delete the Start block')
      return
    }
    
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ))
  }, [nodes])

  const handleNodesDelete = useCallback((nodeIds: string[]) => {
    // Check if trying to delete Start block
    const hasStartBlock = nodeIds.some(id => {
      const node = nodes.find(n => n.id === id)
      return node?.data.title === 'Start'
    })
    
    if (hasStartBlock) {
      alert('Cannot delete the Start block')
      return
    }
    
    // Delete nodes and their connections
    setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)))
    setConnections(prev => prev.filter(conn => 
      !nodeIds.includes(conn.from) && !nodeIds.includes(conn.to)
    ))
  }, [nodes])

  // Handle node edit (double-click)
  const handleNodeEdit = useCallback((nodeId: string) => {
    // Navigate to block editing mode
    router.push(`/workflow/${workflowId}/block/${nodeId}`)
  }, [workflowId, router])

  // Handle drag from sidebar
  const handleBlockDragStart = (blockType: BlockType, e: React.DragEvent) => {
    setDraggedBlockType(blockType)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', blockType.type) // Simple data for validation
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDropProcessingRef.current || !draggedBlockType) {
      return
    }

    if (draggedBlockType.type === 'start') {
      const hasStartBlock = nodes.some(node => node.data.title === 'Start')
      if (hasStartBlock) {
        alert('Only one Start block is allowed per workflow')
        setDraggedBlockType(null)
        return
      }
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
      case 'start':
        iconColor = 'text-success-500'
        statusColor = 'success'
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
      case 'end':
        iconColor = 'text-error-500'
        statusColor = 'error'
        break
    }

    const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newNode: Node = {
      id: nodeId,
      x,
      y,
      data: {
        title: draggedBlockType.label,
        icon: getIconForNodeType(draggedBlockType.type, iconColor),
        description: `New ${draggedBlockType.label.toLowerCase()} block`,
        status: statusColor,
        nodeType: draggedBlockType.type
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
    
    if (type === 'output') {
      console.log('[v0] Starting connection from:', nodeId, 'port:', port || 'default')
      // Store the port information with the connecting node
      setConnectingFrom(port ? `${nodeId}:${port}` : nodeId)
    } else if (type === 'input') {
      if (connectingFrom && !connectingFrom.startsWith(nodeId)) {
        // Parse the connecting from to get node id and port
        const [fromNodeId, fromPort] = connectingFrom.split(':')
        
        console.log('[v0] Completing connection from', fromNodeId, 'port', fromPort, 'to', nodeId)
        
        // Determine label based on port
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
  }, [connectingFrom])

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
  }, [])

  useEffect(() => {
    if (viewMode === 'json') {
      const workflowJSON = {
        id: workflowId,
        title: workflowTitle,
        nodes: nodes.map(node => ({
          id: node.id,
          x: node.x,
          y: node.y,
          data: {
            title: node.data.title,
            description: node.data.description,
            status: node.data.status,
            nodeType: node.data.nodeType
          }
        })),
        connections: connections,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      setJsonData(workflowJSON)
    }
  }, [viewMode, nodes, connections, workflowId, workflowTitle])

  const handleJSONChange = useCallback((newData: any) => {
    setJsonData(newData)
    
    // Update visual state from JSON
    if (newData.title) setWorkflowTitle(newData.title)
    if (newData.nodes) {
      const nodesWithIcons = newData.nodes.map((node: any) => {
        const nodeType = node.data.nodeType || 'action'
        const blockType = BLOCK_TYPES.find(b => b.type === nodeType)
        const color = blockType?.color || 'text-gray-500'
        
        return {
          ...node,
          data: {
            ...node.data,
            icon: getIconForNodeType(nodeType, color)
          }
        }
      })
      setNodes(nodesWithIcons)
    }
    if (newData.connections) setConnections(newData.connections)
  }, [])

  const handleFormatJSON = useCallback(() => {
    const formatted = {
      ...jsonData,
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        data: {
          title: node.data.title,
          description: node.data.description,
          status: node.data.status,
          nodeType: node.data.nodeType
        }
      })),
      connections: connections
    }
    setJsonData(formatted)
  }, [jsonData, nodes, connections])

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
      // Delete key to delete selected node(s)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault()
        handleNodeDelete(selectedNodeId)
      }
      
      // ESC to cancel connection
      if (e.key === 'Escape' && connectingFrom) {
        setConnectingFrom(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, connectingFrom])

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-[#1A1A1A]">
      {/* Top Bar */}
      <div className="flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-[#252525]">
        {/* Left: Back button and title */}
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

        {/* Right: View mode toggle + Action buttons */}
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Block Library or JSON Actions */}
        <div
          className={cn(
            'relative border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-[#252525]',
            isSidebarOpen ? 'w-[250px]' : 'w-0'
          )}
        >
          {/* Toggle Button */}
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

        {/* Center - Canvas or JSON Editor */}
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
            >
              {nodes.map((node) => (
                <WorkflowNode
                  key={node.id}
                  id={node.id}
                  title={node.data.title}
                  icon={node.data.icon}
                  description={node.data.description}
                  status={node.data.status}
                  selected={selectedNodeId === node.id}
                  onDelete={() => handleNodeDelete(node.id)}
                  onEdit={() => handleNodeEdit(node.id)}
                  onPortClick={(type, port) => handlePortClick(node.id, type, port)}
                  isConnecting={connectingFrom?.startsWith(node.id)}
                  nodeType={node.data.nodeType as any}
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

        {/* Right Panel - AI Chat */}
        {isChatOpen && (
          <ChatPanel
            context="workflow_creation"
            workflowId={workflowId}
            onClose={() => setIsChatOpen(false)}
            onAction={(action, data) => {
              console.log('[v0] Chat action:', action, data)
              
              // Handle workflow update from WorkflowManagement classification
              if (action === 'workflow_update' && data.workflow) {
                const updatedWorkflow = data.workflow
                
                // Preserve the workflow ID from the current workflow
                const preservedId = workflowId
                
                // Update workflow title
                if (updatedWorkflow.title) {
                  setWorkflowTitle(updatedWorkflow.title)
                }
                
                // Convert nodes to UI format with icons
                if (updatedWorkflow.nodes) {
                  const nodesWithIcons = updatedWorkflow.nodes.map((node: any) => {
                    const nodeType = node.data.nodeType || 'action'
                    const blockType = BLOCK_TYPES.find(b => b.type === nodeType)
                    const color = blockType?.color || 'text-gray-500'
                    
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        icon: getIconForNodeType(nodeType, color)
                      }
                    }
                  })
                  setNodes(nodesWithIcons)
                }
                
                // Update connections
                if (updatedWorkflow.connections) {
                  setConnections(updatedWorkflow.connections)
                }
                
                // Save to localStorage
                const workflowData = {
                  id: preservedId, // Preserve original workflow ID
                  title: updatedWorkflow.title || workflowTitle,
                  nodes: updatedWorkflow.nodes.map((node: any) => ({
                    ...node,
                    data: {
                      ...node.data,
                      icon: undefined // Remove icon for storage
                    }
                  })),
                  connections: updatedWorkflow.connections,
                  updatedAt: new Date().toISOString()
                }
                localStorage.setItem(`workflow_${preservedId}`, JSON.stringify(workflowData))
                
                console.log('[v0] Workflow updated from chat response, ID preserved:', preservedId)
              }
            }}
          />
        )}
      </div>

      {/* Show chat button if closed */}
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

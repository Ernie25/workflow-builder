'use client'

import { useRef, useState, useEffect, useCallback, type MouseEvent } from 'react'
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'
import { ConnectionLine } from './connection-line'
import { cn } from '@/lib/utils'

export interface Node {
  id: string
  type: string
  name: string
  position: {
    x: number
    y: number
  }
  data?: {
    icon?: React.ReactNode
    description?: string
    status?: 'pending' | 'success' | 'error' | 'running'
  }
}

export interface Connection {
  id: string
  from: string
  to: string
  fromPort?: 'output' | 'true' | 'false' // Added true/false for decision branches
  toPort?: 'input'
  label?: string // Added label for connection
}

export interface WorkflowCanvasProps {
  nodes: Node[]
  connections: Connection[]
  onNodeMove?: (nodeId: string, x: number, y: number) => void
  onNodeSelect?: (nodeId: string, multi: boolean) => void
  onConnect?: (nodeId: string, type: 'input' | 'output', port?: string) => void // Added port parameter
  onConnectionDelete?: (connectionId: string) => void
  onChange?: () => void
  connectingFrom?: string | null
  children?: React.ReactNode | React.ReactNode[]
  onNodeDelete?: (nodeIds: string[]) => void
  isChatOpen?: boolean
  entrypointNodeId?: string | null // Added entrypointNodeId prop
}

export function WorkflowCanvas({
  nodes,
  connections,
  onNodeMove,
  onNodeSelect,
  onConnect,
  onConnectionDelete,
  onChange,
  connectingFrom,
  children,
  onNodeDelete,
  isChatOpen = false,
  entrypointNodeId = null,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2.0))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleFitScreen = useCallback(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const padding = 50
    const bounds = nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + 200), // Node width
        maxY: Math.max(acc.maxY, node.position.y + 150), // Approximate node height
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    )

    const width = bounds.maxX - bounds.minX + padding * 2
    const height = bounds.maxY - bounds.minY + padding * 2
    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerY = (bounds.minY + bounds.maxY) / 2

    const canvasWidth = canvasRef.current.clientWidth
    const canvasHeight = canvasRef.current.clientHeight

    const scaleX = canvasWidth / width
    const scaleY = canvasHeight / height
    const newZoom = Math.min(scaleX, scaleY, 1)

    setZoom(newZoom)
    setPan({
      x: canvasWidth / 2 - centerX * newZoom,
      y: canvasHeight / 2 - centerY * newZoom,
    })
  }, [nodes])

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isCanvasBackground = target === canvasRef.current || target.closest('[data-canvas-background]')
    
    if (isCanvasBackground) {
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [pan])

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (connectingFrom) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const mouseX = (e.clientX - rect.left - pan.x) / zoom
          const mouseY = (e.clientY - rect.top - pan.y) / zoom
          setMousePosition({ x: mouseX, y: mouseY })
        }
      }

      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        })
      }

      if (draggedNode && e.buttons === 1) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = (e.clientX - rect.left - pan.x - dragOffset.x) / zoom
        const y = (e.clientY - rect.top - pan.y - dragOffset.y) / zoom

        onNodeMove?.(draggedNode, x, y)
      }
    },
    [isPanning, panStart, draggedNode, pan, zoom, dragOffset, onNodeMove, connectingFrom]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setDraggedNode(null)
  }, [])

  const handleNodeClick = useCallback(
    (nodeId: string, multi: boolean) => {
      if (multi) {
        setSelectedNodes((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(nodeId)) {
            newSet.delete(nodeId)
          } else {
            newSet.add(nodeId)
          }
          return newSet
        })
      } else {
        setSelectedNodes(new Set([nodeId]))
      }
      onNodeSelect?.(nodeId, multi)
    },
    [onNodeSelect]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNodes.size > 0) {
        const nodesToDelete = Array.from(selectedNodes)
        onNodeDelete?.(nodesToDelete)
        setSelectedNodes(new Set()) // Clear selection after deletion
      }
      if (e.key === 'Escape' && connectingFrom) {
        onConnect?.('', 'input') // Signal to cancel connection
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodes, onNodeDelete, connectingFrom, onConnect])

  const handleNodeDragStart = useCallback(
    (nodeId: string, e: MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        console.log('[v0] Skipping drag - clicked on button')
        return
      }
      
      e.stopPropagation()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      console.log('[v0] Starting node drag:', nodeId)
      setDraggedNode(nodeId)
      setDragOffset({
        x: (e.clientX - rect.left - pan.x) / zoom - node.position.x,
        y: (e.clientY - rect.top - pan.y) / zoom - node.position.y,
      })
    },
    [nodes, pan, zoom]
  )

  const handlePortClickInternal = useCallback(
    (nodeId: string, type: 'input' | 'output', port?: string) => {
      onConnect?.(nodeId, type, port)
    },
    [onConnect]
  )

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-[#1A1A1A]">
      <div
        ref={canvasRef}
        className={cn(
          'relative w-full h-full',
          isPanning && 'cursor-grabbing',
          !isPanning && 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-canvas-background
        style={{
          backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <svg
            className="absolute top-0 left-0 pointer-events-auto"
            style={{
              width: '5000px',
              height: '5000px',
              overflow: 'visible',
            }}
          >
            {connections.map((connection) => {
              const fromNode = nodes.find((n) => n.id === connection.from)
              const toNode = nodes.find((n) => n.id === connection.to)

              if (!fromNode || !toNode) return null

              let fromY = fromNode.position.y + 50 // Default center
              
              if (connection.fromPort === 'true') {
                fromY = fromNode.position.y + 33 // Top third for true branch
              } else if (connection.fromPort === 'false') {
                fromY = fromNode.position.y + 67 // Bottom third for false branch
              }
              
              const fromX = fromNode.position.x + 200 // Right edge of node
              const toX = toNode.position.x // Left edge of node
              const toY = toNode.position.y + 50 // Port vertical center

              return (
                <ConnectionLine
                  key={connection.id}
                  from={{ x: fromX, y: fromY }}
                  to={{ x: toX, y: toY }}
                  type="standard"
                  label={connection.label} // Pass label to connection line
                  onDelete={() => onConnectionDelete?.(connection.id)}
                />
              )
            })}

            {connectingFrom && (
              (() => {
                const [fromNodeId, fromPort] = connectingFrom.split(':')
                const fromNode = nodes.find((n) => n.id === fromNodeId)
                if (!fromNode) return null

                // Calculate position based on port
                let fromY = fromNode.position.y + 50
                if (fromPort === 'true') {
                  fromY = fromNode.position.y + 33
                } else if (fromPort === 'false') {
                  fromY = fromNode.position.y + 67
                }

                const fromX = fromNode.position.x + 200

                return (
                  <ConnectionLine
                    from={{ x: fromX, y: fromY }}
                    to={{ x: mousePosition.x, y: mousePosition.y }}
                    type="standard"
                    label={fromPort === 'true' ? 'True' : fromPort === 'false' ? 'False' : undefined}
                  />
                )
              })()
            )}
          </svg>

          {nodes.map((node, index) => {
            const childrenArray = Array.isArray(children) ? children : [children]
            const nodeChild = childrenArray[index]

            const isSelected = selectedNodes.has(node.id)

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                }}
                onMouseDown={(e) => handleNodeDragStart(node.id, e)}
                onClick={(e) => handleNodeClick(node.id, e.ctrlKey || e.metaKey)}
                className={cn(
                  isSelected && 'ring-2 ring-primary-500 ring-offset-2 rounded-lg'
                )}
              >
                {nodeChild && React.cloneElement(nodeChild as React.ReactElement, {
                  onPortClick: (type: 'input' | 'output', port?: string) =>
                    handlePortClickInternal(node.id, type, port),
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div 
        className="absolute bottom-4 flex flex-col gap-2 z-50 transition-all duration-300"
        style={{ right: isChatOpen ? '366px' : '16px' }}
      >
        <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleFitScreen}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg',
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500',
              'transition-all duration-150 shadow-sm'
            )}
            aria-label="Fit to screen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomIn}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg',
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500',
              'transition-all duration-150 shadow-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={zoom >= 2.0}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg',
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500',
              'transition-all duration-150 shadow-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg',
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500',
              'transition-all duration-150 shadow-sm'
            )}
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
          <div>Drag canvas to pan</div>
          <div><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px]">Ctrl</kbd> + Click for multi-select</div>
          <div><kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px]">Del</kbd> to delete selected</div>
          {entrypointNodeId && (
            <div className="text-green-600 dark:text-green-400 font-medium">
              Entrypoint node has no input port
            </div>
          )}
          {connectingFrom && (
            <div className="text-primary-500 font-medium">
              Click input port to connect • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px]">ESC</kbd> to cancel
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

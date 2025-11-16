'use client'

import { type ReactNode, type DragEvent, useState } from 'react'
import { MoreVertical, Play, Trash2, Plus } from 'lucide-react'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

export interface WorkflowNodeProps {
  id: string
  name: string
  icon: ReactNode
  description?: string
  status?: 'pending' | 'success' | 'error' | 'running'
  selected?: boolean
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void
  onPortClick?: (type: 'input' | 'output', port?: string) => void
  onDelete?: () => void
  onEdit?: () => void
  isConnecting?: boolean
  nodeType?: 'trigger' | 'form' | 'action' | 'decision'
  isEntrypoint?: boolean
  className?: string
}

export function WorkflowNode({
  id,
  name,
  icon,
  description,
  status,
  selected = false,
  onDragStart,
  onPortClick,
  onDelete,
  onEdit,
  isConnecting = false,
  nodeType = 'action',
  isEntrypoint = false,
  className,
}: WorkflowNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDropdownMenu, setShowDropdownMenu] = useState(false)

  const handleDoubleClick = () => {
    onEdit?.()
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDropdownMenu(true)
    setTimeout(() => setShowDropdownMenu(false), 3000)
  }

  const handlePortClickInternal = (e: React.MouseEvent, type: 'input' | 'output', port?: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('[v0] Port clicked:', type, port || 'default', 'for node:', id)
    onPortClick?.(type, port)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDropdownMenu(!showDropdownMenu)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDropdownMenu(false)
    onDelete?.()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDropdownMenu(false)
    onEdit?.()
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowDropdownMenu(false)
      }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      className={cn(
        'relative w-[200px] rounded-md border transition-all duration-150',
        'cursor-move select-none',
        isEntrypoint ? 'bg-green-50 dark:bg-green-950' : 'bg-white dark:bg-[#252525]',
        !selected && !isHovered && 'border-gray-200 dark:border-gray-700 shadow-sm',
        isHovered && !selected && 'border-primary-500 shadow-md',
        selected && 'border-2 border-primary-500 shadow-lg ring-2 ring-primary-500/20',
        isConnecting && 'ring-4 ring-primary-400 animate-pulse',
        className
      )}
    >
      {/* Input Port - all nodes can receive connections */}
      {!isEntrypoint && (
        <button
          onClick={(e) => handlePortClickInternal(e, 'input')}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          className={cn(
            'absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
            'w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-[#252525]',
            'hover:bg-primary-500 hover:scale-150 transition-all duration-150',
            'cursor-pointer'
          )}
          aria-label="Input port"
        />
      )}

      {/* Output Ports - decision nodes have two, others have one */}
      {nodeType === 'decision' ? (
        <>
          {/* True Output Port */}
          <button
            onClick={(e) => handlePortClickInternal(e, 'output', 'true')}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            className={cn(
              'absolute right-0 top-1/3 translate-x-1/2 -translate-y-1/2 z-20',
              'w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#252525]',
              'hover:bg-green-600 hover:scale-150 transition-all duration-150',
              'cursor-pointer',
              isConnecting && 'scale-150 ring-2 ring-green-300'
            )}
            aria-label="True output port"
            title="True"
          />
          
          {/* False Output Port */}
          <button
            onClick={(e) => handlePortClickInternal(e, 'output', 'false')}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            className={cn(
              'absolute right-0 top-2/3 translate-x-1/2 -translate-y-1/2 z-20',
              'w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-[#252525]',
              'hover:bg-red-600 hover:scale-150 transition-all duration-150',
              'cursor-pointer',
              isConnecting && 'bg-primary-500 scale-150 ring-2 ring-primary-300'
            )}
            aria-label="False output port"
            title="False"
          />
        </>
      ) : (
        <button
          onClick={(e) => handlePortClickInternal(e, 'output')}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          className={cn(
            'absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20',
            'w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-[#252525]',
            'hover:bg-primary-500 hover:scale-150 transition-all duration-150',
            'cursor-pointer',
            isConnecting && 'bg-primary-500 scale-150 ring-2 ring-primary-300'
          )}
          aria-label="Output port"
        />
      )}

      {/* Node Content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          {/* Icon */}
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            {icon}
          </div>

          {/* Name and Status */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 truncate">
              {name}
            </h3>
            {status && (
              <div className="mt-1">
                <Badge status={status} size="sm" />
              </div>
            )}
          </div>

          {/* Menu Button */}
          <button
            onClick={handleMenuClick}
            onMouseDown={(e) => e.stopPropagation()}
            className={cn(
              'flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
              'text-gray-500 dark:text-gray-400',
              showDropdownMenu && 'bg-gray-100 dark:bg-gray-700'
            )}
            aria-label="Node options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {showDropdownMenu && (
        <div
          className={cn(
            'absolute top-full right-0 mt-1 z-30',
            'bg-white dark:bg-[#252525] rounded-md shadow-lg border border-gray-200 dark:border-gray-700',
            'min-w-[140px] py-1',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleEditClick}
            className="w-full px-3 py-1.5 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            Edit Block
          </button>
          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
          <button
            onClick={handleDeleteClick}
            className="w-full px-3 py-1.5 text-left text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Block
          </button>
        </div>
      )}
    </div>
  )
}

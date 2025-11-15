'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ConfigPanelTab {
  id: string
  label: string
  content: React.ReactNode
}

export interface ConfigPanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  tabs?: ConfigPanelTab[]
  defaultTab?: string
  className?: string
}

export const ConfigPanel = React.forwardRef<HTMLDivElement, ConfigPanelProps>(
  ({ isOpen, onClose, title = 'Configuration', tabs = [], defaultTab, className }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')
    const [width, setWidth] = useState(350)
    const [isResizing, setIsResizing] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    const resizeHandleRef = useRef<HTMLDivElement>(null)

    // Update active tab when defaultTab changes
    useEffect(() => {
      if (defaultTab) {
        setActiveTab(defaultTab)
      }
    }, [defaultTab])

    // Handle resize
    useEffect(() => {
      if (!isResizing) return

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = window.innerWidth - e.clientX
        const minWidth = 300
        const maxWidth = window.innerWidth * 0.5

        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth)
        }
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [isResizing])

    // Handle escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
      <>
        {/* Backdrop overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-200"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Panel */}
        <div
          ref={ref || panelRef}
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full flex-col border-l bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-[#252525] dark:border-gray-700',
            isOpen ? 'translate-x-0' : 'translate-x-full',
            className
          )}
          style={{ width: `${width}px` }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-panel-title"
        >
          {/* Resize Handle */}
          <div
            ref={resizeHandleRef}
            className={cn(
              'absolute left-0 top-0 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary-500',
              isResizing && 'bg-primary-500'
            )}
            onMouseDown={() => setIsResizing(true)}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b px-4 dark:border-gray-700">
            <h2 id="config-panel-title" className="text-heading-s text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          {tabs.length > 0 && (
            <div
              className="flex h-10 shrink-0 items-center border-b px-4 dark:border-gray-700"
              role="tablist"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative px-4 py-2 text-body transition-colors',
                    activeTab === tab.id
                      ? 'font-medium text-primary-500'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  {tab.label}
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {tabs.length > 0 ? (
              <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
              >
                {activeTabContent}
              </div>
            ) : (
              <div className="text-body text-gray-500 dark:text-gray-400">
                No content available
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
)

ConfigPanel.displayName = 'ConfigPanel'

'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Save, Box, Code, Maximize, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatPanel } from '@/components/ChatPanel'
import { JSONEditor } from '@/components/JSONEditor'
import { cn } from '@/lib/utils'
import { FormBlockEditor } from '@/components/block-editors/FormBlockEditor'
import { ActionBlockEditor } from '@/components/block-editors/ActionBlockEditor'
import { DecisionBlockEditor } from '@/components/block-editors/DecisionBlockEditor'

export default function BlockEditorPage() {
  const params = useParams()
  const router = useRouter()
  const blockId = params.blockId as string
  const workflowId = params.id as string

  const [blockName, setBlockName] = React.useState('Untitled Block')
  const [blockType, setBlockType] = React.useState<string | null>(null)
  const [blockData, setBlockData] = React.useState<any>({})
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  
  const [viewMode, setViewMode] = React.useState<'visual' | 'json'>('visual')
  const [jsonData, setJsonData] = React.useState<any>({})

  React.useEffect(() => {
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    
    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow)
      const node = workflow.nodes?.find((n: any) => n.id === blockId)
      
      if (node) {
        const detectedType = node.type || 'action'
        setBlockType(detectedType)
        setBlockName(node.name || 'Untitled Block')
        setBlockData(node.data || {})
      } else {
        setBlockType('action')
      }
    } else {
      setBlockType('action')
    }
  }, [blockId, workflowId])

  React.useEffect(() => {
    if (viewMode === 'json') {
      const blockJSON = {
        id: blockId,
        name: blockName,
        type: blockType,
        data: blockData,
        metadata: {
          updatedAt: new Date().toISOString()
        }
      }
      setJsonData(blockJSON)
    }
  }, [viewMode, blockId, blockName, blockType, blockData])

  const handleSave = () => {
    setIsSaving(true)
    
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow)
      const nodeIndex = workflow.nodes?.findIndex((n: any) => n.id === blockId)
      
      if (nodeIndex !== -1) {
        workflow.nodes[nodeIndex].data = blockData
        workflow.nodes[nodeIndex].name = blockName
        workflow.updatedAt = new Date().toISOString()
        localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflow))
      }
    }
    
    setTimeout(() => {
      setIsSaving(false)
      setHasUnsavedChanges(false)
      alert('Block saved successfully!')
    }, 300)
  }

  const handleDataChange = (newData: any) => {
    setBlockData(newData)
    setHasUnsavedChanges(true)
    
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow)
      const nodeIndex = workflow.nodes?.findIndex((n: any) => n.id === blockId)
      
      if (nodeIndex !== -1) {
        workflow.nodes[nodeIndex].data = {
          ...workflow.nodes[nodeIndex].data,
          ...newData
        }
        workflow.updatedAt = new Date().toISOString()
        localStorage.setItem(`workflow_${workflowId}`, JSON.stringify(workflow))
      }
    }
  }

  const handleJSONChange = React.useCallback((newData: any) => {
    setJsonData(newData)
    
    if (newData.name) setBlockName(newData.name)
    if (newData.data) {
      setBlockData(newData.data)
      setHasUnsavedChanges(true)
    }
  }, [])

  const handleFormatJSON = React.useCallback(() => {
    const formatted = {
      id: blockId,
      name: blockName,
      type: blockType,
      data: blockData,
      metadata: {
        updatedAt: new Date().toISOString()
      }
    }
    setJsonData(formatted)
  }, [blockId, blockName, blockType, blockData])

  const handleValidateJSON = React.useCallback(() => {
    try {
      JSON.parse(JSON.stringify(jsonData))
      return { valid: true }
    } catch (err: any) {
      return { valid: false, error: err.message }
    }
  }, [jsonData])

  if (!blockType) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading block editor...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="flex h-[60px] items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={() => router.push(`/workflow/${workflowId}`)}
          >
            Back
          </Button>
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            className="text-heading-m border-none bg-transparent text-gray-900 outline-none focus:underline"
          />
          <span className="text-body-small text-slate-500">
            ({blockType})
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'flex items-center gap-1.5 rounded px-3 py-1.5 text-body-small transition-colors',
                viewMode === 'visual'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
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
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Code className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>

          {hasUnsavedChanges && (
            <span className="text-body-small text-slate-500">Unsaved changes</span>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content - Render appropriate editor based on view mode */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'visual' ? (
          <>
            {blockType === 'form' && (
              <FormBlockEditor
                blockId={blockId}
                workflowId={workflowId}
                data={blockData}
                onChange={handleDataChange}
                isChatOpen={isChatOpen}
                onChatToggle={setIsChatOpen}
              />
            )}
            
            {blockType === 'action' && (
              <ActionBlockEditor
                blockId={blockId}
                workflowId={workflowId}
                data={blockData}
                onChange={handleDataChange}
                isChatOpen={isChatOpen}
                onChatToggle={setIsChatOpen}
              />
            )}
            
            {blockType === 'decision' && (
              <DecisionBlockEditor
                blockId={blockId}
                workflowId={workflowId}
                data={blockData}
                onChange={handleDataChange}
                isChatOpen={isChatOpen}
                onChatToggle={setIsChatOpen}
              />
            )}
          </>
        ) : (
          <>
            <div className="flex flex-1">
              {/* Left sidebar for JSON actions */}
              <div className="w-[200px] border-r border-slate-200 bg-white p-4">
                <h3 className="text-heading-s mb-4 text-gray-900">
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
              </div>

              {/* JSON Editor */}
              <div className="flex-1">
                <JSONEditor
                  data={jsonData}
                  onChange={handleJSONChange}
                  onFormat={handleFormatJSON}
                  onValidate={handleValidateJSON}
                />
              </div>
            </div>
          </>
        )}

        {/* AI Chat Panel */}
        {isChatOpen && (
          <ChatPanel
            context={viewMode === 'json' ? 'json_mode' : 'block_editing'}
            workflowId={workflowId}
            currentBlockId={blockId}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

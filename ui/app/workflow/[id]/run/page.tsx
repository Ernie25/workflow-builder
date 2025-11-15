'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatPanel } from '@/components/ChatPanel'

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'dropdown' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'signature'
  label: string
  required: boolean
  placeholder?: string
  helperText?: string
  defaultValue?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

interface FormButton {
  id: string
  label: string
  action: 'next' | 'previous' | 'submit' | 'cancel'
  variant: 'primary' | 'secondary' | 'tertiary'
}

interface WorkflowBlock {
  id: string
  type: 'start' | 'form' | 'action' | 'decision' | 'end'
  label: string
  config?: {
    fields?: FormField[]
    buttons?: FormButton[]
  }
}

interface WorkflowData {
  id: string
  name: string
  nodes: WorkflowBlock[]
  connections: any[]
}

interface WorkflowState {
  currentBlockId: string
  formData: Record<string, Record<string, any>>
  completedBlocks: string[]
  status: 'in_progress' | 'completed'
}

export default function WorkflowRunPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  // State management
  const [workflow, setWorkflow] = React.useState<WorkflowData | null>(null)
  const [workflowState, setWorkflowState] = React.useState<WorkflowState | null>(null)
  const [currentBlock, setCurrentBlock] = React.useState<WorkflowBlock | null>(null)
  const [formValues, setFormValues] = React.useState<Record<string, any>>({})
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [unsavedChanges, setUnsavedChanges] = React.useState(false)
  const [noFormError, setNoFormError] = React.useState(false)

  // Load workflow and state on mount
  React.useEffect(() => {
    console.log('[v0] Loading workflow:', workflowId)
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    console.log('[v0] Saved workflow:', savedWorkflow)
    
    if (savedWorkflow) {
      const workflowData: WorkflowData = JSON.parse(savedWorkflow)
      console.log('[v0] Parsed workflow data:', workflowData)
      setWorkflow(workflowData)

      // Load or initialize workflow state
      const savedState = sessionStorage.getItem(`workflow_run_${workflowId}`)
      if (savedState) {
        const state: WorkflowState = JSON.parse(savedState)
        setWorkflowState(state)
        
        const block = workflowData.nodes.find(b => b.id === state.currentBlockId)
        if (block) {
          setCurrentBlock(block)
          setFormValues(state.formData[state.currentBlockId] || {})
        }
      } else {
        // Initialize new workflow run - start at first form block
        const firstFormBlock = workflowData.nodes.find(n => {
          // Check if node has config with fields (indicating it's a form)
          return n.data?.nodeType === 'form' || (n.data?.config?.fields && n.data.config.fields.length > 0)
        })
        
        console.log('[v0] First form block:', firstFormBlock)
        
        if (firstFormBlock) {
          const initialState: WorkflowState = {
            currentBlockId: firstFormBlock.id,
            formData: {},
            completedBlocks: [],
            status: 'in_progress'
          }
          setWorkflowState(initialState)
          const blockData: WorkflowBlock = {
            id: firstFormBlock.id,
            type: 'form',
            label: firstFormBlock.data.label || 'Form',
            config: firstFormBlock.data.config
          }
          setCurrentBlock(blockData)
          sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(initialState))
        } else {
          console.error('[v0] No form blocks found in workflow')
          setNoFormError(true)
        }
      }
    } else {
      console.log('[v0] No workflow data found, checking portal workflows list')
      const portalWorkflows = localStorage.getItem('workflows')
      
      if (portalWorkflows) {
        const workflows = JSON.parse(portalWorkflows)
        const mockWorkflow = workflows.find((w: any) => w.id === workflowId)
        
        if (mockWorkflow) {
          console.log('[v0] Found mock workflow, creating default form structure')
          // Create a default form structure for mock workflows
          const defaultWorkflowData: WorkflowData = {
            id: workflowId,
            name: mockWorkflow.name,
            nodes: [
              {
                id: 'form-1',
                type: 'form',
                label: mockWorkflow.name,
                data: {
                  nodeType: 'form',
                  label: mockWorkflow.name,
                  config: {
                    fields: [
                      {
                        id: 'field-1',
                        type: 'text',
                        label: 'Full Name',
                        required: true,
                        placeholder: 'Enter your full name'
                      },
                      {
                        id: 'field-2',
                        type: 'email',
                        label: 'Email',
                        required: true,
                        placeholder: 'your.email@example.com'
                      },
                      {
                        id: 'field-3',
                        type: 'phone',
                        label: 'Phone Number',
                        required: false,
                        placeholder: '(123) 456-7890'
                      }
                    ],
                    buttons: []
                  }
                }
              }
            ],
            connections: []
          }
          
          setWorkflow(defaultWorkflowData)
          
          // Initialize workflow state
          const initialState: WorkflowState = {
            currentBlockId: 'form-1',
            formData: {},
            completedBlocks: [],
            status: 'in_progress'
          }
          setWorkflowState(initialState)
          
          const blockData: WorkflowBlock = {
            id: 'form-1',
            type: 'form',
            label: mockWorkflow.name,
            config: defaultWorkflowData.nodes[0].data.config
          }
          setCurrentBlock(blockData)
          sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(initialState))
        } else {
          console.error('[v0] Workflow not found in portal list either')
        }
      } else {
        console.error('[v0] No workflow found in localStorage')
      }
    }
  }, [workflowId])

  // Save state when form values change
  React.useEffect(() => {
    if (workflowState && currentBlock) {
      const newState = {
        ...workflowState,
        formData: {
          ...workflowState.formData,
          [currentBlock.id]: formValues
        }
      }
      sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(newState))
      setUnsavedChanges(true)
    }
  }, [formValues, workflowState, currentBlock, workflowId])

  // Validate field
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`
    }

    if (value && field.validation) {
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern)
        if (!regex.test(value)) {
          return field.validation.message || 'Invalid format'
        }
      }
      if (field.validation.min && value.length < field.validation.min) {
        return `Minimum ${field.validation.min} characters required`
      }
      if (field.validation.max && value.length > field.validation.max) {
        return `Maximum ${field.validation.max} characters allowed`
      }
    }

    return null
  }

  // Validate all fields
  const validateAllFields = (): boolean => {
    if (!currentBlock?.config?.fields) return true

    const errors: Record<string, string> = {}
    let hasErrors = false

    currentBlock.config.fields.forEach(field => {
      const error = validateField(field, formValues[field.id])
      if (error) {
        errors[field.id] = error
        hasErrors = true
      }
    })

    setValidationErrors(errors)
    return !hasErrors
  }

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
    
    // Clear validation error for this field
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  // Navigate to next block
  const handleNext = () => {
    if (!validateAllFields()) return

    setIsSubmitting(true)
    
    // Mark current block as completed
    const newState = {
      ...workflowState!,
      completedBlocks: [...workflowState!.completedBlocks, currentBlock!.id]
    }

    const formBlocks = workflow!.nodes.filter(n => n.data?.nodeType === 'form' || (n.data?.config?.fields && n.data.config.fields.length > 0))
    const currentIndex = formBlocks.findIndex(b => b.id === currentBlock!.id)
    const nextNode = formBlocks[currentIndex + 1]

    if (nextNode) {
      newState.currentBlockId = nextNode.id
      setWorkflowState(newState)
      const nextBlock: WorkflowBlock = {
        id: nextNode.id,
        type: 'form',
        label: nextNode.data.label || 'Form',
        config: nextNode.data.config
      }
      setCurrentBlock(nextBlock)
      setFormValues(newState.formData[nextNode.id] || {})
      sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(newState))
      setUnsavedChanges(false)
    }

    setIsSubmitting(false)
  }

  // Navigate to previous block
  const handlePrevious = () => {
    const formBlocks = workflow!.nodes.filter(n => n.data?.nodeType === 'form' || (n.data?.config?.fields && n.data.config.fields.length > 0))
    const currentIndex = formBlocks.findIndex(b => b.id === currentBlock!.id)
    const previousNode = formBlocks[currentIndex - 1]

    if (previousNode) {
      const newState = {
        ...workflowState!,
        currentBlockId: previousNode.id
      }
      setWorkflowState(newState)
      const prevBlock: WorkflowBlock = {
        id: previousNode.id,
        type: 'form',
        label: previousNode.data.label || 'Form',
        config: previousNode.data.config
      }
      setCurrentBlock(prevBlock)
      setFormValues(newState.formData[previousNode.id] || {})
      sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(newState))
    }
  }

  // Submit workflow
  const handleSubmit = () => {
    if (!validateAllFields()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const newState: WorkflowState = {
        ...workflowState!,
        completedBlocks: [...workflowState!.completedBlocks, currentBlock!.id],
        status: 'completed'
      }
      setWorkflowState(newState)
      sessionStorage.setItem(`workflow_run_${workflowId}`, JSON.stringify(newState))
      setUnsavedChanges(false)
      setIsSubmitting(false)
    }, 1000)
  }

  // Handle cancel
  const handleCancel = () => {
    if (unsavedChanges) {
      if (confirm('You have unsaved changes. Discard and go back?')) {
        sessionStorage.removeItem(`workflow_run_${workflowId}`)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }

  // Calculate progress
  const getProgress = () => {
    if (!workflow || !workflowState) return { current: 0, total: 0, percentage: 0 }
    
    const formBlocks = workflow.nodes.filter(n => n.data?.nodeType === 'form' || (n.data?.config?.fields && n.data.config.fields.length > 0))
    const current = formBlocks.findIndex(b => b.id === currentBlock?.id) + 1
    const total = formBlocks.length
    const percentage = (workflowState.completedBlocks.length / total) * 100

    return { current, total, percentage }
  }

  const progress = getProgress()
  const isFirstBlock = progress.current === 1
  const isLastBlock = progress.current === progress.total

  // Render field based on type
  const renderField = (field: FormField) => {
    const value = formValues[field.id] || ''
    const error = validationErrors[field.id]

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-label block text-slate-900">
              {field.label}
              {field.required && <span className="ml-1 text-error-500">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-body text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {field.helperText && !error && (
              <p className="text-body-small italic text-slate-600">{field.helperText}</p>
            )}
            {error && (
              <p className="text-body-small text-error-600">{error}</p>
            )}
          </div>
        )

      case 'dropdown':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-label block text-slate-900">
              {field.label}
              {field.required && <span className="ml-1 text-error-500">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="h-[40px] w-full rounded-md border border-slate-300 bg-white px-3 text-body text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select...</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.helperText && !error && (
              <p className="text-body-small italic text-slate-600">{field.helperText}</p>
            )}
            {error && (
              <p className="text-body-small text-error-600">{error}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <label className="text-label block text-slate-900">
              {field.label}
              {field.required && <span className="ml-1 text-error-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(value || []), option]
                        : (value || []).filter((v: string) => v !== option)
                      handleFieldChange(field.id, newValue)
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-body text-slate-900">{option}</span>
                </label>
              ))}
            </div>
            {field.helperText && !error && (
              <p className="text-body-small italic text-slate-600">{field.helperText}</p>
            )}
            {error && (
              <p className="text-body-small text-error-600">{error}</p>
            )}
          </div>
        )

      default:
        return (
          <Input
            key={field.id}
            type={field.type}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            helperText={field.helperText}
            error={error}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        )
    }
  }

  if (noFormError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-warning-500" />
          <h1 className="text-heading-l mb-2 text-slate-900">No Form Blocks Found</h1>
          <p className="text-body mb-6 text-slate-600">
            This workflow doesn't contain any form blocks. Add at least one form block in the workflow editor to make it runnable.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push('/')}>
              Return to Portal
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/workflow/${workflowId}`)}>
              Edit Workflow
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!workflow || !workflowState || !currentBlock) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  // Completed state
  if (workflowState.status === 'completed') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success-500" />
          <h1 className="text-heading-l mb-2 text-slate-900">Workflow Complete!</h1>
          <p className="text-body mb-6 text-slate-600">
            Your submission has been successfully completed.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Portal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="flex h-16 items-center border-b border-slate-200 bg-white px-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-body">Back</span>
        </button>
        
        <h1 className="text-heading-l ml-6 text-slate-900">{workflow.name}</h1>
        
        <div className="ml-auto flex items-center gap-4">
          <span className="text-body text-slate-600">
            Step {progress.current} of {progress.total}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-1 overflow-hidden transition-all duration-300 ${isChatOpen ? 'mr-[350px]' : 'mr-0'}`}>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Bar */}
          <div className="mx-auto mb-6 max-w-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-body-small text-slate-600">
                {progress.percentage.toFixed(0)}% Complete
              </span>
              <span className="text-body-small text-slate-600">
                {workflowState.completedBlocks.length} of {progress.total} blocks completed
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-primary-500 transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-heading-l mb-6 text-slate-900">{currentBlock.label}</h2>
            
            {/* Form Fields */}
            <div className="space-y-6">
              {currentBlock.config?.fields?.map(renderField)}
            </div>

            {/* Form Buttons */}
            <div className="mt-8 flex gap-2">
              {!isFirstBlock && (
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              
              {!isLastBlock && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  loading={isSubmitting}
                >
                  Next
                </Button>
              )}
              
              {isLastBlock && (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              )}
              
              <Button
                variant="tertiary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Open AI Assistant Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-20 flex h-12 items-center gap-2 rounded-full bg-primary-500 px-6 text-button text-white shadow-lg transition-all duration-200 hover:bg-primary-600 hover:shadow-xl"
        >
          Open AI Assistant
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <ChatPanel
          context="end_user_help"
          onClose={() => setIsChatOpen(false)}
          workflowId={workflowId}
          currentBlockId={currentBlock.id}
        />
      )}
    </div>
  )
}

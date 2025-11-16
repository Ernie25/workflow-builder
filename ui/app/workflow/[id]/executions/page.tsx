'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, Ban } from 'lucide-react'

interface WorkflowExecution {
  id: string
  workflowId: string
  name: string
  description: string
  status: 'notStarted' | 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled'
  startedAt: string
  finishedAt: string | null
  context: Record<string, any>
}

export default function WorkflowExecutionsPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [workflowName, setWorkflowName] = useState<string>('')

  useEffect(() => {
    // Load workflow name
    const savedWorkflow = localStorage.getItem(`workflow_${workflowId}`)
    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow)
      setWorkflowName(workflow.name || 'Workflow')
    } else {
      // Check portal workflows
      const portalWorkflows = localStorage.getItem('workflows')
      if (portalWorkflows) {
        const workflows = JSON.parse(portalWorkflows)
        const workflow = workflows.find((w: any) => w.id === workflowId)
        if (workflow) {
          setWorkflowName(workflow.name)
        }
      }
    }

    // Load executions
    const savedExecutions = localStorage.getItem(`executions_${workflowId}`)
    if (savedExecutions) {
      const executionsList = JSON.parse(savedExecutions)
      // Sort by startedAt descending (most recent first)
      executionsList.sort((a: WorkflowExecution, b: WorkflowExecution) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
      setExecutions(executionsList)
    }
  }, [workflowId])

  const getStatusIcon = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'notStarted':
        return <Clock className="h-5 w-5" />
      case 'pending':
        return <Clock className="h-5 w-5" />
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'succeeded':
        return <CheckCircle2 className="h-5 w-5" />
      case 'failed':
        return <XCircle className="h-5 w-5" />
      case 'cancelled':
        return <Ban className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'notStarted':
        return <Badge status="pending" text="Not Started" size="sm" />
      case 'pending':
        return <Badge status="pending" text="Pending" size="sm" />
      case 'running':
        return <Badge status="info" text="Running" size="sm" />
      case 'succeeded':
        return <Badge status="success" text="Succeeded" size="sm" />
      case 'failed':
        return <Badge status="error" text="Failed" size="sm" />
      case 'cancelled':
        return <Badge status="warning" text="Cancelled" size="sm" />
      default:
        return <Badge status="pending" text={status} size="sm" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDuration = (execution: WorkflowExecution) => {
    if (!execution.finishedAt) {
      return 'In progress'
    }
    const start = new Date(execution.startedAt).getTime()
    const end = new Date(execution.finishedAt).getTime()
    const durationMs = end - start
    const seconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
      {/* Top Bar */}
      <header className="h-[60px] bg-white dark:bg-[#252525] border-b border-slate-200 dark:border-[#374151] px-6 flex items-center gap-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-[#F3F4F6] transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-body">Back to Workflows</span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-[#374151]" />
        
        <h1 className="text-heading-l text-slate-900 dark:text-[#F3F4F6]">
          {workflowName} - Executions
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-heading-l text-slate-900 dark:text-[#F3F4F6] mb-2">
                Execution History
              </h2>
              <p className="text-body text-slate-600 dark:text-[#D1D5DB]">
                View all executions of this workflow
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => router.push(`/workflow/${workflowId}/run`)}
            >
              Execute Workflow
            </Button>
          </div>

          {/* Executions List */}
          {executions.length === 0 ? (
            <Card variant="outlined" className="p-12 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-heading-m text-slate-900 dark:text-[#F3F4F6] mb-2">
                No Executions Yet
              </h3>
              <p className="text-body text-slate-600 dark:text-[#D1D5DB] mb-6">
                This workflow hasn't been executed yet. Start your first execution to see it here.
              </p>
              <Button 
                variant="primary"
                onClick={() => router.push(`/workflow/${workflowId}/run`)}
              >
                Execute Workflow
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <Card 
                  key={execution.id}
                  variant="outlined"
                  className="p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-slate-600 dark:text-[#D1D5DB]">
                          {getStatusIcon(execution.status)}
                        </div>
                        <h3 className="text-heading-s text-slate-900 dark:text-[#F3F4F6]">
                          Execution #{execution.id}
                        </h3>
                        {getStatusBadge(execution.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-label text-slate-500 dark:text-slate-400 mb-1">
                            Started At
                          </p>
                          <p className="text-body-small text-slate-900 dark:text-[#F3F4F6]">
                            {formatDate(execution.startedAt)}
                          </p>
                        </div>
                        
                        {execution.finishedAt && (
                          <div>
                            <p className="text-label text-slate-500 dark:text-slate-400 mb-1">
                              Finished At
                            </p>
                            <p className="text-body-small text-slate-900 dark:text-[#F3F4F6]">
                              {formatDate(execution.finishedAt)}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-label text-slate-500 dark:text-slate-400 mb-1">
                            Duration
                          </p>
                          <p className="text-body-small text-slate-900 dark:text-[#F3F4F6]">
                            {getDuration(execution)}
                          </p>
                        </div>
                      </div>

                      {Object.keys(execution.context).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#374151]">
                          <p className="text-label text-slate-500 dark:text-slate-400 mb-2">
                            Context Variables
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(execution.context).map(([key, value]) => (
                              <div 
                                key={key}
                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-body-small text-slate-900 dark:text-[#F3F4F6]"
                              >
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

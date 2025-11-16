'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Plus, LayoutGrid, Settings, Moon, Sun, ChevronDown, Menu, X, Edit2, Trash2, Eye, EyeOff, Play, History } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  isPublished: boolean
  lastEdited: string
}

type UserRole = 'admin' | 'user'
type Tab = 'published' | 'draft'

export default function WorkflowPortal() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedTab, setSelectedTab] = useState<Tab>('published')
  const [userRole, setUserRole] = useState<UserRole>('admin')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null)

  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows')
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows))
    } else {
      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Customer Onboarding',
          description: 'Automated workflow for new customer registration and setup',
          isPublished: true,
          lastEdited: '2024-01-15',
        },
        {
          id: '2',
          name: 'Invoice Processing',
          description: 'Automated invoice approval and payment processing',
          isPublished: true,
          lastEdited: '2024-01-14',
        },
        {
          id: '3',
          name: 'Employee Onboarding',
          description: 'Streamlined new hire documentation and training workflow',
          isPublished: false,
          lastEdited: '2024-01-13',
        },
        {
          id: '4',
          name: 'Support Ticket Routing',
          description: 'Intelligent routing of support tickets to appropriate teams',
          isPublished: true,
          lastEdited: '2024-01-12',
        },
        {
          id: '5',
          name: 'Marketing Campaign',
          description: 'Multi-channel campaign automation with analytics',
          isPublished: false,
          lastEdited: '2024-01-11',
        },
      ]
      setWorkflows(mockWorkflows)
      localStorage.setItem('workflows', JSON.stringify(mockWorkflows))
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    if (workflows.length > 0) {
      localStorage.setItem('workflows', JSON.stringify(workflows))
    }
  }, [workflows])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const togglePublish = (id: string) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === id ? { ...w, isPublished: !w.isPublished } : w
      )
    )
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
    setDeleteModalId(null)
  }

  const createNewWorkflow = () => {
    const newId = Date.now().toString()
    router.push(`/workflow/${newId}`)
  }

  const executeWorkflow = (workflowId: string) => {
    // Create a new execution
    const execution = {
      id: Date.now().toString(),
      workflowId: workflowId,
      name: workflows.find(w => w.id === workflowId)?.name || 'Workflow',
      description: workflows.find(w => w.id === workflowId)?.description || '',
      status: 'notStarted',
      startedAt: new Date().toISOString(),
      finishedAt: null,
      context: {}
    }

    // Save execution to localStorage
    const existingExecutions = localStorage.getItem(`executions_${workflowId}`)
    const executions = existingExecutions ? JSON.parse(existingExecutions) : []
    executions.push(execution)
    localStorage.setItem(`executions_${workflowId}`, JSON.stringify(executions))

    // Navigate to the workflow run page
    router.push(`/workflow/${workflowId}/run`)
  }

  const filteredWorkflows = userRole === 'admin' 
    ? workflows.filter((w) => selectedTab === 'published' ? w.isPublished : !w.isPublished)
    : workflows.filter((w) => w.isPublished) // Users only see published workflows

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A] transition-colors duration-200">
      {/* Top Bar */}
      <header className="h-[60px] bg-white dark:bg-[#252525] border-b border-slate-200 dark:border-[#374151] px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-heading-l text-[#111827] dark:text-[#F3F4F6]">
              ESP.AI
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-body font-medium text-primary-700 dark:text-primary-300">
                  AU
                </span>
              </div>
              <span className="text-body text-[#111827] dark:text-[#F3F4F6] hidden sm:inline">
                Admin User
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#252525] border border-[#E5E7EB] dark:border-[#374151] rounded-lg shadow-lg py-1 z-50">
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full px-4 py-2 text-left text-body hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-[#F3F4F6]"
                >
                  Profile
                </button>
                <button 
                  onClick={() => router.push('/logout')}
                  className="w-full px-4 py-2 text-left text-body hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-900 dark:text-[#F3F4F6]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-[250px]' : 'w-0 lg:w-[250px]'
          } bg-white dark:bg-[#252525] border-r border-slate-200 dark:border-[#374151] transition-all duration-200 overflow-hidden fixed lg:relative h-[calc(100vh-60px)] z-40`}
        >
          <div className="p-4 space-y-6">
            {/* Navigation */}
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                <LayoutGrid className="h-5 w-5" />
                <span className="text-body font-medium">Workflows</span>
              </button>
              <button 
                onClick={() => router.push('/settings')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-[#D1D5DB] transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="text-body">Settings</span>
              </button>
            </nav>

            {/* View Mode Selector */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#374151]">
              <label className="text-label text-slate-600 dark:text-[#D1D5DB] mb-2 block">
                VIEW MODE
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#374151] rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-60px)] relative">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-[#F3F4F6]">
              {userRole === 'admin' ? 'My Workflows' : 'Available Workflows'}
            </h1>
          </div>

          {/* Tabs (Admin only) */}
          {userRole === 'admin' && (
            <div className="flex items-center gap-6 mb-6 border-b border-slate-200 dark:border-[#374151]">
              <button
                onClick={() => setSelectedTab('published')}
                className={`pb-3 px-1 text-body font-medium transition-all relative ${
                  selectedTab === 'published'
                    ? 'text-slate-900 dark:text-[#F3F4F6]'
                    : 'text-slate-600 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
                }`}
              >
                Published
                {selectedTab === 'published' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('draft')}
                className={`pb-3 px-1 text-body font-medium transition-all relative ${
                  selectedTab === 'draft'
                    ? 'text-slate-900 dark:text-[#F3F4F6]'
                    : 'text-slate-600 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
                }`}
              >
                Draft
                {selectedTab === 'draft' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500" />
                )}
              </button>
            </div>
          )}

          {/* Create Button (Admin only) */}
          {userRole === 'admin' && (
            <div className="fixed top-20 right-6 z-30">
              <Button 
                icon={<Plus className="h-4 w-4" />} 
                variant="primary"
                onClick={createNewWorkflow}
              >
                Create New Workflow
              </Button>
            </div>
          )}

          {/* Workflow List */}
          <div className="space-y-4 mt-16 lg:mt-4">
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-heading-m text-slate-900 dark:text-[#F3F4F6] mb-2">
                  {userRole === 'admin' ? 'No workflows yet' : 'No workflows available'}
                </p>
                <p className="text-body text-slate-600 dark:text-[#D1D5DB]">
                  {userRole === 'admin' 
                    ? 'Create your first workflow to get started'
                    : 'Check back later for available workflows'}
                </p>
                {userRole === 'admin' && (
                  <Button
                    icon={<Plus className="h-4 w-4" />}
                    variant="primary"
                    className="mt-6"
                    onClick={createNewWorkflow}
                  >
                    Create Workflow
                  </Button>
                )}
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  variant="outlined"
                  className="p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md group cursor-pointer transition-all"
                  onClick={() => {
                    if (userRole === 'admin') {
                      router.push(`/workflow/${workflow.id}`)
                    } else {
                      router.push(`/workflow/${workflow.id}/run`)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-heading-s text-slate-900 dark:text-[#F3F4F6]">
                          {workflow.name}
                        </h3>
                        <Badge
                          status={workflow.isPublished ? 'success' : 'pending'}
                          text={workflow.isPublished ? 'Published' : 'Draft'}
                          size="sm"
                        />
                      </div>
                      <p className="text-body-small text-slate-600 dark:text-[#D1D5DB] mb-2">
                        {workflow.description}
                      </p>
                      {userRole === 'admin' && (
                        <p className="text-body-small text-slate-500 dark:text-slate-400">
                          Last edited: {workflow.lastEdited}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {userRole === 'admin' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePublish(workflow.id)
                            }}
                            className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            title={workflow.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {workflow.isPublished ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/workflow/${workflow.id}`)
                            }}
                            className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteModalId(workflow.id)
                            }}
                            className="p-2 text-slate-400 hover:text-error-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          {workflow.isPublished && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  executeWorkflow(workflow.id)
                                }}
                                className="p-2 text-slate-400 hover:text-success-600 dark:hover:text-success-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="Execute Workflow"
                              >
                                <Play className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/workflow/${workflow.id}/executions`)
                                }}
                                className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="View Executions"
                              >
                                <History className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="primary" 
                            size="sm"
                            icon={<Play className="h-4 w-4" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              executeWorkflow(workflow.id)
                            }}
                          >
                            Execute
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            icon={<History className="h-4 w-4" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/workflow/${workflow.id}/executions`)
                            }}
                          >
                            Executions
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#252525] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-heading-m text-slate-900 dark:text-[#F3F4F6] mb-2">
              Delete Workflow
            </h3>
            <p className="text-body text-slate-600 dark:text-[#D1D5DB] mb-6">
              Are you sure you want to delete this workflow? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="tertiary"
                onClick={() => setDeleteModalId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteWorkflow(deleteModalId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

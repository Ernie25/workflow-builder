'use client'

import * as React from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Condition {
  id: string
  field: string
  operator: string
  value: string
  logicOperator?: 'AND' | 'OR'
}

interface DecisionBlockEditorProps {
  blockId: string
  workflowId: string
  data: any
  onChange: (data: any) => void
  isChatOpen: boolean
  onChatToggle: (open: boolean) => void
}

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
]

export function DecisionBlockEditor({ blockId, workflowId, data, onChange, isChatOpen, onChatToggle }: DecisionBlockEditorProps) {
  const [conditions, setConditions] = React.useState<Condition[]>(data.conditions || [
    { id: '1', field: '', operator: 'equals', value: '' }
  ])
  const [truePath, setTruePath] = React.useState<string>(data.truePath || '')
  const [falsePath, setFalsePath] = React.useState<string>(data.falsePath || '')

  React.useEffect(() => {
    onChange({ conditions, truePath, falsePath })
  }, [conditions, truePath, falsePath])

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      logicOperator: 'AND'
    }
    setConditions([...conditions, newCondition])
  }

  const handleRemoveCondition = (id: string) => {
    if (conditions.length === 1) return
    setConditions(conditions.filter(c => c.id !== id))
  }

  const handleConditionChange = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  return (
    <>
      {/* Main Content */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          isChatOpen && "mr-[350px]"
        )}
      >
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <GitBranch className="w-6 h-6 text-warning-500" />
            <h2 className="text-heading-m text-slate-900">Decision Logic</h2>
          </div>

          <div className="mb-6">
            <p className="text-body text-slate-600 mb-4">
              Define conditions that determine which path the workflow takes
            </p>
          </div>

          {/* Conditions Builder */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-s text-slate-900">Conditions</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddCondition}
              >
                Add Condition
              </Button>
            </div>

            {conditions.map((condition, index) => (
              <div key={condition.id} className="space-y-3">
                {index > 0 && (
                  <div className="flex items-center gap-2 pl-4">
                    <select
                      value={condition.logicOperator}
                      onChange={(e) => handleConditionChange(condition.id, { logicOperator: e.target.value as 'AND' | 'OR' })}
                      className="w-24 h-[32px] rounded-md border border-slate-200 px-2 text-body-small font-medium text-slate-700"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-3 items-start">
                    {/* Field Input */}
                    <div className="col-span-4">
                      <label className="text-label mb-1.5 block text-slate-700">Field</label>
                      <Input
                        value={condition.field}
                        onChange={(e) => handleConditionChange(condition.id, { field: e.target.value })}
                        placeholder="e.g., email"
                      />
                    </div>

                    {/* Operator Select */}
                    <div className="col-span-4">
                      <label className="text-label mb-1.5 block text-slate-700">Operator</label>
                      <select
                        value={condition.operator}
                        onChange={(e) => handleConditionChange(condition.id, { operator: e.target.value })}
                        className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
                      >
                        {OPERATORS.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Value Input */}
                    <div className="col-span-3">
                      <label className="text-label mb-1.5 block text-slate-700">Value</label>
                      <Input
                        value={condition.value}
                        onChange={(e) => handleConditionChange(condition.id, { value: e.target.value })}
                        placeholder="value"
                        disabled={condition.operator === 'is_empty' || condition.operator === 'is_not_empty'}
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex items-end">
                      <button
                        onClick={() => handleRemoveCondition(condition.id)}
                        disabled={conditions.length === 1}
                        className="h-[40px] w-full flex items-center justify-center text-slate-400 hover:text-error-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Branch Configuration */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-heading-s text-slate-900 mb-4">Branch Paths</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success-50 border-2 border-success-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-success-500"></div>
                  <h4 className="text-body-medium font-semibold text-slate-900">If True</h4>
                </div>
                <p className="text-body-small text-slate-600 mb-3">
                  What happens when conditions are met
                </p>
                <Input
                  value={truePath}
                  onChange={(e) => setTruePath(e.target.value)}
                  placeholder="Enter next step or action"
                />
              </div>

              <div className="bg-error-50 border-2 border-error-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-error-500"></div>
                  <h4 className="text-body-medium font-semibold text-slate-900">If False</h4>
                </div>
                <p className="text-body-small text-slate-600 mb-3">
                  What happens when conditions fail
                </p>
                <Input
                  value={falsePath}
                  onChange={(e) => setFalsePath(e.target.value)}
                  placeholder="Enter alternative step or action"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Button */}
      {!isChatOpen && (
        <button
          onClick={() => onChatToggle(true)}
          className={cn(
            'fixed bottom-4 z-40 flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-white shadow-lg transition-all duration-300',
            'hover:bg-primary-600 hover:shadow-xl right-20'
          )}
        >
          <span className="text-body-small font-medium">Open AI Assistant</span>
        </button>
      )}
    </>
  )
}

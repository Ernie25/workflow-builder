'use client'

import * as React from 'react'
import { GripVertical, Trash2, Plus, Type, Mail, Phone, Hash, Calendar, Clock, ChevronDown, CheckSquare, Circle, FileText, Upload, PenTool, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

// Field type definitions
interface FieldType {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  helperText?: string
  validation?: string
  defaultValue?: string
  options?: string[]
}

interface FormButton {
  id: string
  label: string
  action: 'next' | 'previous' | 'submit' | 'cancel'
  variant: 'primary' | 'secondary' | 'tertiary'
}

const FIELD_TYPES: FieldType[] = [
  { id: 'text', label: 'Text Input', icon: <Type className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'number', label: 'Number', icon: <Hash className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'date', label: 'Date Picker', icon: <Calendar className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'time', label: 'Time Picker', icon: <Clock className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'dropdown', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'radio', label: 'Radio Buttons', icon: <Circle className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'textarea', label: 'Text Area', icon: <FileText className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'file', label: 'File Upload', icon: <Upload className="w-4 h-4" />, color: 'text-slate-600' },
  { id: 'signature', label: 'Signature', icon: <PenTool className="w-4 h-4" />, color: 'text-slate-600' },
]

interface FormBlockEditorProps {
  blockId: string
  workflowId: string
  data: any
  onChange: (data: any) => void
  isChatOpen: boolean
  onChatToggle: (open: boolean) => void
}

export function FormBlockEditor({ blockId, workflowId, data, onChange, isChatOpen, onChatToggle }: FormBlockEditorProps) {
  const [fields, setFields] = React.useState<FormField[]>(data.fields || [])
  const [buttons, setButtons] = React.useState<FormButton[]>(data.buttons || [])
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null)
  const [selectedButtonId, setSelectedButtonId] = React.useState<string | null>(null)
  const [draggedFieldType, setDraggedFieldType] = React.useState<string | null>(null)
  const [draggedFieldIndex, setDraggedFieldIndex] = React.useState<number | null>(null)
  const [draggedButtonIndex, setDraggedButtonIndex] = React.useState<number | null>(null)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = React.useState(false)

  React.useEffect(() => {
    onChange({ fields, buttons })
  }, [fields, buttons])

  const selectedField = fields.find(f => f.id === selectedFieldId)
  const selectedButton = buttons.find(b => b.id === selectedButtonId)

  const handleDragStart = (fieldType: string) => {
    setDraggedFieldType(fieldType)
  }

  const handleDragEnd = () => {
    setDraggedFieldType(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedFieldType) {
      const fieldType = FIELD_TYPES.find(f => f.id === draggedFieldType)
      if (fieldType) {
        const newField: FormField = {
          id: `field-${Date.now()}`,
          type: draggedFieldType,
          label: fieldType.label,
          required: false,
          placeholder: `Enter ${fieldType.label.toLowerCase()}`,
        }
        setFields([...fields, newField])
        setDraggedFieldType(null)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFieldClick = (fieldId: string) => {
    setSelectedFieldId(fieldId)
    setSelectedButtonId(null)
  }

  const handleButtonClick = (buttonId: string) => {
    setSelectedButtonId(buttonId)
    setSelectedFieldId(null)
  }

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId))
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f))
  }

  const handleAddButton = () => {
    const newButton: FormButton = {
      id: `button-${Date.now()}`,
      label: 'Submit',
      action: 'submit',
      variant: 'primary'
    }
    setButtons([...buttons, newButton])
  }

  const handleDeleteButton = (buttonId: string) => {
    setButtons(buttons.filter(b => b.id !== buttonId))
  }

  const handleUpdateButton = (buttonId: string, updates: Partial<FormButton>) => {
    setButtons(buttons.map(b => b.id === buttonId ? { ...b, ...updates } : b))
  }

  const handleFieldDragStart = (index: number) => {
    setDraggedFieldIndex(index)
  }

  const handleFieldDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedFieldIndex === null || draggedFieldIndex === index) return

    const newFields = [...fields]
    const draggedField = newFields[draggedFieldIndex]
    newFields.splice(draggedFieldIndex, 1)
    newFields.splice(index, 0, draggedField)
    
    setFields(newFields)
    setDraggedFieldIndex(index)
  }

  const handleFieldDragEnd = () => {
    setDraggedFieldIndex(null)
  }

  const handleButtonDragStart = (index: number) => {
    setDraggedButtonIndex(index)
  }

  const handleButtonDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedButtonIndex === null || draggedButtonIndex === index) return

    const newButtons = [...buttons]
    const draggedButton = newButtons[draggedButtonIndex]
    newButtons.splice(draggedButtonIndex, 1)
    newButtons.splice(index, 0, draggedButton)
    
    setButtons(newButtons)
    setDraggedButtonIndex(index)
  }

  const handleButtonDragEnd = () => {
    setDraggedButtonIndex(null)
  }

  return (
    <>
      <div 
        className={cn(
          "transition-all duration-300 border-r border-slate-200 bg-white overflow-y-auto",
          isLeftSidebarCollapsed ? "w-0" : "w-72"
        )}
      >
        {!isLeftSidebarCollapsed && (
          <div className="px-4 py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Add Fields</h3>
            <p className="text-sm text-slate-600 mb-4">Drag to add</p>
            
            <div className="space-y-2">
              {FIELD_TYPES.map((fieldType) => (
                <div
                  key={fieldType.id}
                  draggable
                  onDragStart={() => handleDragStart(fieldType.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:bg-slate-50 hover:shadow-sm",
                    draggedFieldType === fieldType.id && "opacity-50"
                  )}
                >
                  <div className={cn("flex-shrink-0", fieldType.color)}>
                    {fieldType.icon}
                  </div>
                  <span className="text-body text-slate-900">{fieldType.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        className="absolute left-0 top-[50%] translate-y-[-50%] z-30 bg-white border border-slate-200 rounded-r-md p-1 hover:bg-slate-50 transition-all shadow-sm"
        style={{ left: isLeftSidebarCollapsed ? '0' : '288px' }}
      >
        {isLeftSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>

      <div
        className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          (selectedField || selectedButton) && !isChatOpen && "mr-80",
          isChatOpen && "mr-[350px]"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          {fields.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-heading-m text-slate-600 mb-2">No fields yet</h3>
              <p className="text-body text-slate-500">
                Drag fields from the left sidebar to start building your form
              </p>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <FieldBlock
                key={field.id}
                field={field}
                index={index}
                isSelected={field.id === selectedFieldId}
                onClick={() => handleFieldClick(field.id)}
                onDelete={() => handleDeleteField(field.id)}
                onDragStart={() => handleFieldDragStart(index)}
                onDragOver={(e) => handleFieldDragOver(e, index)}
                onDragEnd={handleFieldDragEnd}
                onUpdate={(updates) => handleUpdateField(field.id, updates)}
              />
            ))}
          </div>

          {fields.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-body-medium text-slate-900">Form Actions</h4>
                <button
                  onClick={handleAddButton}
                  className="text-body-small text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Button
                </button>
              </div>
              <div className="space-y-3">
                {buttons.map((button, index) => (
                  <ButtonBlock
                    key={button.id}
                    button={button}
                    index={index}
                    isSelected={button.id === selectedButtonId}
                    onClick={() => handleButtonClick(button.id)}
                    onDelete={() => handleDeleteButton(button.id)}
                    onDragStart={() => handleButtonDragStart(index)}
                    onDragOver={(e) => handleButtonDragOver(e, index)}
                    onDragEnd={handleButtonDragEnd}
                    onUpdate={(updates) => handleUpdateButton(button.id, updates)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedField && !isChatOpen && (
        <FieldConfigPanel
          field={selectedField}
          onUpdate={(updates) => handleUpdateField(selectedField.id, updates)}
          onClose={() => setSelectedFieldId(null)}
        />
      )}

      {selectedButton && !isChatOpen && (
        <ButtonConfigPanel
          button={selectedButton}
          onUpdate={(updates) => handleUpdateButton(selectedButton.id, updates)}
          onClose={() => setSelectedButtonId(null)}
        />
      )}

      {!isChatOpen && (
        <button
          onClick={() => onChatToggle(true)}
          className={cn(
            'fixed bottom-4 z-40 flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-white shadow-lg transition-all duration-300',
            'hover:bg-primary-600 hover:shadow-xl',
            (selectedField || selectedButton) && !isChatOpen ? 'right-[340px]' : 'right-20'
          )}
        >
          <span className="text-body-small font-medium">Open AI Assistant</span>
        </button>
      )}
    </>
  )
}

function FieldBlock({
  field,
  index,
  isSelected,
  onClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUpdate,
}: {
  field: FormField
  index: number
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  onUpdate: (updates: Partial<FormField>) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedLabel, setEditedLabel] = React.useState(field.label)

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleLabelBlur = () => {
    setIsEditing(false)
    if (editedLabel.trim() && editedLabel !== field.label) {
      onUpdate({ label: editedLabel })
    } else {
      setEditedLabel(field.label)
    }
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedLabel(field.label)
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group relative bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-2 border-primary-500 bg-slate-50" : "border-slate-200"
      )}
    >
      <div className="flex items-start gap-3">
        <button className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                onBlur={handleLabelBlur}
                onKeyDown={handleLabelKeyDown}
                autoFocus
                className="text-body-medium text-slate-900 bg-white border border-primary-500 rounded px-2 py-1 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 
                className="text-body-medium text-slate-900 cursor-text"
                onDoubleClick={handleLabelDoubleClick}
                title="Double-click to edit"
              >
                {field.label}
              </h4>
            )}
            {field.required && <span className="text-error-500">*</span>}
          </div>
          <p className="text-body-small text-slate-500 mt-0.5">
            {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex-shrink-0 text-slate-400 hover:text-error-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ButtonBlock({
  button,
  index,
  isSelected,
  onClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUpdate,
}: {
  button: FormButton
  index: number
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  onUpdate: (updates: Partial<FormButton>) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedLabel, setEditedLabel] = React.useState(button.label)

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleLabelBlur = () => {
    setIsEditing(false)
    if (editedLabel.trim() && editedLabel !== button.label) {
      onUpdate({ label: editedLabel })
    } else {
      setEditedLabel(button.label)
    }
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedLabel(button.label)
    }
  }

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-lg p-3 transition-all cursor-pointer",
        isSelected ? "bg-slate-50 border-2 border-primary-500" : "bg-white border border-slate-200 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-slate-400" />
        {isEditing ? (
          <input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            autoFocus
            className="text-body text-slate-900 bg-white border border-primary-500 rounded px-2 py-1 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="text-body text-slate-900 cursor-text"
            onDoubleClick={handleLabelDoubleClick}
            title="Double-click to edit"
          >
            {button.label}
          </span>
        )}
        <span className="text-body-small text-slate-500">({button.action})</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-slate-400 hover:text-error-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

function FieldConfigPanel({
  field,
  onUpdate,
  onClose,
}: {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onClose: () => void
}) {
  const [isValidationOpen, setIsValidationOpen] = React.useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)
  const [localField, setLocalField] = React.useState(field)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    setLocalField(field)
    setHasChanges(false)
  }, [field])

  const hasOptions = ['dropdown', 'checkbox', 'radio'].includes(field.type)

  const handleChange = (updates: Partial<FormField>) => {
    setLocalField({ ...localField, ...updates })
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate(localField)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setLocalField(field)
    setHasChanges(false)
    onClose()
  }

  return (
    <div className="fixed right-0 top-[60px] w-80 h-[calc(100vh-60px)] bg-white border-l border-slate-200 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300 z-20">
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-s text-slate-900">Field Settings</h3>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <Input
            label="Field Label"
            value={localField.label}
            onChange={(e) => handleChange({ label: e.target.value })}
          />

          <div>
            <label className="text-label mb-2 block text-slate-900">Field Type</label>
            <div className="h-[40px] flex items-center px-3 rounded-md border border-slate-200 bg-slate-50 text-body text-slate-600">
              {localField.type.charAt(0).toUpperCase() + localField.type.slice(1)}
            </div>
          </div>

          <Toggle
            checked={localField.required}
            onChange={(checked) => handleChange({ required: checked })}
            label="Required field"
          />

          <Input
            label="Placeholder"
            value={localField.placeholder || ''}
            onChange={(e) => handleChange({ placeholder: e.target.value })}
          />

          <Input
            label="Helper Text"
            value={localField.helperText || ''}
            onChange={(e) => handleChange({ helperText: e.target.value })}
            helperText="Optional text to help users fill this field"
          />

          <Input
            label="Default Value"
            value={localField.defaultValue || ''}
            onChange={(e) => handleChange({ defaultValue: e.target.value })}
            helperText="Optional default value"
          />

          <div>
            <button
              onClick={() => setIsValidationOpen(!isValidationOpen)}
              className="flex items-center justify-between w-full py-2 text-body-medium text-slate-900 hover:text-slate-700 transition-colors"
            >
              <span>Validation Rules</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isValidationOpen && "rotate-180")} />
            </button>
            {isValidationOpen && (
              <div className="mt-3 space-y-3">
                <Input
                  label="Pattern (regex)"
                  value={localField.validation || ''}
                  onChange={(e) => handleChange({ validation: e.target.value })}
                  placeholder="e.g., ^[A-Za-z]+$"
                  helperText="Optional regex pattern for validation"
                />
              </div>
            )}
          </div>

          {hasOptions && (
            <div>
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="flex items-center justify-between w-full py-2 text-body-medium text-slate-900 hover:text-slate-700 transition-colors"
              >
                <span>Options</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOptionsOpen && "rotate-180")} />
              </button>
              {isOptionsOpen && (
                <div className="mt-3 space-y-2">
                  {(localField.options || ['Option 1', 'Option 2']).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(localField.options || [])]
                          newOptions[index] = e.target.value
                          handleChange({ options: newOptions })
                        }}
                        className="flex-1 h-[32px] rounded-md border border-slate-200 px-3 text-body"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = (localField.options || []).filter((_, i) => i !== index)
                          handleChange({ options: newOptions })
                        }}
                        className="text-slate-400 hover:text-error-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(localField.options || []), '']
                      handleChange({ options: newOptions })
                    }}
                    className="text-body-small text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add option
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4 bg-white flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function ButtonConfigPanel({
  button,
  onUpdate,
  onClose,
}: {
  button: FormButton
  onUpdate: (updates: Partial<FormButton>) => void
  onClose: () => void
}) {
  const [localButton, setLocalButton] = React.useState(button)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    setLocalButton(button)
    setHasChanges(false)
  }, [button])

  const handleChange = (updates: Partial<FormButton>) => {
    const newButton = { ...localButton, ...updates }
    setLocalButton(newButton)
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate(localButton)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setLocalButton(button)
    setHasChanges(false)
    onClose()
  }

  return (
    <div className="fixed right-0 top-[60px] w-80 h-[calc(100vh-60px)] bg-white border-l border-slate-200 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300 z-20">
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-s text-slate-900">Button Settings</h3>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <Input
            label="Button Label"
            value={localButton.label}
            onChange={(e) => handleChange({ label: e.target.value })}
          />

          <div>
            <label className="text-label mb-2 block text-slate-900">Action</label>
            <select
              value={localButton.action}
              onChange={(e) => handleChange({ action: e.target.value as FormButton['action'] })}
              className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
            >
              <option value="next">Next Step</option>
              <option value="previous">Previous Step</option>
              <option value="submit">Submit Form</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>

          <div>
            <label className="text-label mb-2 block text-slate-900">Button Style</label>
            <select
              value={localButton.variant}
              onChange={(e) => handleChange({ variant: e.target.value as FormButton['variant'] })}
              className="w-full h-[40px] rounded-md border border-slate-200 px-3 text-body"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="tertiary">Tertiary</option>
            </select>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-body-small text-slate-600 mb-2">Preview:</p>
            <Button 
              key={`${localButton.label}-${localButton.variant}-${localButton.action}`}
              variant={localButton.variant} 
              size="md" 
              className="w-full"
            >
              {localButton.label}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4 bg-white flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Code, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JSONEditorProps {
  data: any
  onChange: (data: any) => void
  onFormat: () => void
  onValidate: () => { valid: boolean; error?: string }
}

export function JSONEditor({ data, onChange, onFormat, onValidate }: JSONEditorProps) {
  const [jsonText, setJsonText] = useState('')
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null)

  useEffect(() => {
    // Convert data to formatted JSON string
    setJsonText(JSON.stringify(data, null, 2))
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value)
    setValidationResult(null)
    
    // Try to parse and update parent
    try {
      const parsed = JSON.parse(e.target.value)
      onChange(parsed)
    } catch (err) {
      // Don't update parent if invalid JSON
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonText(formatted)
      onChange(parsed)
      setValidationResult({ valid: true })
    } catch (err: any) {
      setValidationResult({ valid: false, error: err.message })
    }
  }

  const handleValidate = () => {
    try {
      JSON.parse(jsonText)
      setValidationResult({ valid: true })
    } catch (err: any) {
      setValidationResult({ valid: false, error: err.message })
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Validation message */}
      {validationResult && (
        <div
          className={`flex items-center gap-2 border-b px-4 py-2 text-body-small ${
            validationResult.valid
              ? 'border-success-200 bg-success-50 text-success-700'
              : 'border-error-200 bg-error-50 text-error-700'
          }`}
        >
          {validationResult.valid ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Valid JSON</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>Invalid JSON: {validationResult.error}</span>
            </>
          )}
        </div>
      )}

      {/* JSON textarea */}
      <textarea
        value={jsonText}
        onChange={handleChange}
        className="flex-1 font-mono text-sm p-4 bg-slate-900 text-slate-100 resize-none focus:outline-none"
        spellCheck={false}
        placeholder="Enter JSON here..."
      />

      {/* Action buttons (hidden - controlled by parent sidebar) */}
      <div className="hidden">
        <button onClick={handleFormat}>Format</button>
        <button onClick={handleValidate}>Validate</button>
      </div>
    </div>
  )
}

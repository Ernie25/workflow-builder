import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, AlertCircle } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      required,
      helperText,
      error,
      success,
      leftIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const helperTextId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-label mb-2 block",
              disabled
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-900 dark:text-gray-100"
            )}
          >
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            aria-invalid={error ? true : undefined}
            className={cn(
              // Base styles
              "h-[40px] w-full rounded-md border bg-white px-3 text-body transition-all duration-150",
              "placeholder:text-gray-400 dark:bg-gray-800 dark:placeholder:text-gray-500",
              "focus:outline-none focus:ring-2",
              
              // Left padding for icon
              leftIcon && "pl-10",
              
              // Right padding for success/error icons
              (success || error) && "pr-10",
              
              // Default state
              !error && !success && !disabled && 
                "border-gray-300 text-gray-900 focus:border-info-500 focus:ring-info-500/20 dark:border-gray-600 dark:text-gray-100 dark:focus:border-info-400",
              
              // Error state
              error &&
                "border-error-500 text-gray-900 focus:border-error-500 focus:ring-error-500/20 dark:border-error-500 dark:text-gray-100",
              
              // Success state
              success && !error &&
                "border-success-500 text-gray-900 focus:border-success-500 focus:ring-success-500/20 dark:border-success-500 dark:text-gray-100",
              
              // Disabled state
              disabled &&
                "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500",
              
              className
            )}
            {...props}
          />

          {/* Success Icon */}
          {success && !error && (
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-success-500">
              <Check className="h-4 w-4" />
            </div>
          )}

          {/* Error Icon */}
          {error && (
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-error-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={helperTextId}
            className={cn(
              "mt-1.5 text-body-small",
              disabled
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-body-small text-error-500 dark:text-error-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

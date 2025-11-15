'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const toggleVariants = cva(
  'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
      checked: {
        true: 'bg-primary-500',
        false: 'bg-gray-300 dark:bg-gray-600',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
)

const knobVariants = cva(
  'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: false,
        className: 'translate-x-0',
      },
      {
        size: 'sm',
        checked: true,
        className: 'translate-x-4',
      },
      {
        size: 'md',
        checked: false,
        className: 'translate-x-0',
      },
      {
        size: 'md',
        checked: true,
        className: 'translate-x-5',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
)

export interface ToggleProps extends VariantProps<typeof toggleVariants> {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
  className?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, disabled = false, label, id, size = 'md', className }, ref) => {
    const toggleId = id || React.useId()

    const handleToggle = () => {
      if (!disabled) {
        onChange(!checked)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleToggle()
      }
    }

    return (
      <div className={`inline-flex items-center gap-3 ${className || ''}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${toggleId}-label` : undefined}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={toggleVariants({ size, checked })}
        >
          <span className="sr-only">{label || 'Toggle switch'}</span>
          <span className={knobVariants({ size, checked })} />
        </button>
        {label && (
          <label
            id={`${toggleId}-label`}
            htmlFor={toggleId}
            className={`text-body cursor-pointer select-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } text-[rgb(var(--text-primary))]`}
            onClick={() => !disabled && handleToggle()}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

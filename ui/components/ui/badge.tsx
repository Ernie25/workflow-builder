'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react'

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-150',
  {
    variants: {
      status: {
        success: 'bg-[#10B981] text-white',
        error: 'bg-[#EF4444] text-white',
        warning: 'bg-[#F59E0B] text-white',
        pending: 'bg-[#9CA3AF] text-white',
        running: 'bg-[#3B82F6] text-white',
      },
      size: {
        sm: 'px-2 py-1 text-[11px] gap-1',
        md: 'px-3 py-1.5 text-[12px] gap-2',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'md',
    },
  }
)

const iconVariants = cva('flex-shrink-0', {
  variants: {
    size: {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const defaultIcons: Record<string, ReactNode> = {
  success: <CheckCircle2 />,
  error: <XCircle />,
  warning: <AlertTriangle />,
  pending: <Clock />,
  running: <Loader2 className="animate-spin" />,
}

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  status: 'success' | 'error' | 'warning' | 'pending' | 'running'
  text?: string
  icon?: ReactNode
  className?: string
}

export function Badge({ status, text, icon, size, className }: BadgeProps) {
  const displayIcon = icon !== undefined ? icon : defaultIcons[status]

  return (
    <span className={badgeVariants({ status, size, className })}>
      {displayIcon && (
        <span className={iconVariants({ size })}>{displayIcon}</span>
      )}
      {text && <span>{text}</span>}
    </span>
  )
}

export { badgeVariants }

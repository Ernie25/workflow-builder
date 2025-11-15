import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg p-4 transition-all duration-150 ease-out',
  {
    variants: {
      variant: {
        elevated:
          'bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 shadow-md',
        outlined:
          'bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700',
        flat: 'bg-white dark:bg-[#252525]',
      },
      hover: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'elevated',
        hover: true,
        className:
          'hover:shadow-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] active:scale-[0.99]',
      },
      {
        variant: 'outlined',
        hover: true,
        className:
          'hover:shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.99]',
      },
      {
        variant: 'flat',
        hover: true,
        className:
          'hover:bg-gray-50 dark:hover:bg-[#2a2a2a] active:scale-[0.99]',
      },
    ],
    defaultVariants: {
      variant: 'elevated',
      hover: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, onClick, children, ...props }, ref) => {
    const isInteractive = !!onClick || hover

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover: isInteractive }), className)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Subcomponents for better composition
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-3', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-heading-s text-[rgb(var(--text-primary))]', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body-small text-[rgb(var(--text-secondary))] mt-1', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 flex items-center gap-2', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

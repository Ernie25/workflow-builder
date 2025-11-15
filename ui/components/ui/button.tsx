import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-button font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-sm hover:-translate-y-0.5 active:bg-primary-700 active:translate-y-0 active:shadow-inner",
        secondary:
          "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:shadow-sm hover:-translate-y-0.5 active:bg-primary-200 active:translate-y-0 active:shadow-inner",
        tertiary:
          "bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100",
        danger:
          "bg-error-500 text-white hover:bg-error-600 hover:shadow-sm hover:-translate-y-0.5 active:bg-error-700 active:translate-y-0 active:shadow-inner",
      },
      size: {
        sm: "h-[28px] px-3 text-button-small",
        md: "h-[32px] px-4",
        lg: "h-[36px] px-5",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, icon, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

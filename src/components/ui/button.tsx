import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn",
  {
    variants: {
      variant: {
        default: "",
        primary: "btn--primary",
        secondary: "btn--secondary", 
        destructive: "btn--destructive",
        tertiary: "btn--tertiary",
        borderless: "btn--borderless",
        form: "btn--form",
      },
      size: {
        default: "",
        small: "btn--small",
        large: "btn--large",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const fakeButtonVariants = cva(
  "fake-btn",
  {
    variants: {
      variant: {
        default: "",
        primary: "fake-btn--primary",
        secondary: "fake-btn--secondary",
        destructive: "fake-btn--destructive", 
        tertiary: "fake-btn--tertiary",
        borderless: "fake-btn--borderless",
        form: "fake-btn--form",
      },
      size: {
        default: "",
        small: "fake-btn--small",
        large: "fake-btn--large",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    href, 
    icon, 
    iconPosition = 'left', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    // If href is provided, use fake-btn classes for link styling
    const isLink = href || asChild
    const baseClasses = isLink 
      ? fakeButtonVariants({ variant, size, className })
      : buttonVariants({ variant, size, className })

    // Loading state takes precedence over custom icon
    const displayIcon = loading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : icon

    // Content with icon support
    const content = displayIcon ? (
      <span className="btn__cell">
        {iconPosition === 'left' && displayIcon}
        {children && <span className="btn__text">{children}</span>}
        {iconPosition === 'right' && displayIcon}
      </span>
    ) : children

    // Disable button when loading
    const isDisabled = loading || disabled

    if (asChild) {
      return (
        <Slot
          className={cn(baseClasses)}
          ref={ref}
          {...props}
        >
          {content}
        </Slot>
      )
    }

    if (href) {
      return (
        <a
          className={cn(baseClasses, isDisabled && "pointer-events-none opacity-50")}
          href={isDisabled ? undefined : href}
          ref={ref as any}
          aria-disabled={isDisabled}
          {...(props as any)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        className={cn(baseClasses)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, fakeButtonVariants } 
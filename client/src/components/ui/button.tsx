import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary border border-white/10",
        destructive:
          "bg-destructive/90 backdrop-blur-sm text-destructive-foreground hover:bg-destructive border border-white/10",
        outline:
          "border border-input/80 bg-background/60 backdrop-blur-sm hover:bg-accent/80 hover:text-accent-foreground",
        secondary:
          "bg-secondary/80 backdrop-blur-sm text-secondary-foreground hover:bg-secondary border border-white/10",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        acrylic: "bg-primary/70 backdrop-blur-md text-white border border-white/20 hover:bg-primary/90 hover:border-white/30 shadow-lg hover:shadow-blue-300/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/ui/lib/cn"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/**
 * Design-system tooltip (components/tooltip.ts, styles/tooltip.css): indigo pill,
 * xs medium inverse text, with an arrow pointing at the trigger. Opens above it.
 */
const DsTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    side="top"
    sideOffset={sideOffset}
    className={cn(
      "z-50 max-w-[300px] rounded-sm bg-interactive-primary p-3xs text-center text-xs font-medium text-content-inverse",
      className
    )}
    {...props}
  >
    {children}
    <TooltipPrimitive.Arrow width={12} height={4} className="fill-interactive-primary" />
  </TooltipPrimitive.Content>
))
DsTooltipContent.displayName = "DsTooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, DsTooltipContent }

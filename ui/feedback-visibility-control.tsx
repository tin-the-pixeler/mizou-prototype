import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn, FOCUS_RING } from '@/ui/lib/cn';
import { Switch } from '@/ui/switch';
import { Tooltip, DsTooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';

export interface FeedbackVisibilityControlProps {
  /** true = "Visible to manager", false = "Hidden from manager". */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  disabled?: boolean;
  /** Manager's view: eye icon + tooltip only, no popover and no way to change it. */
  readOnly?: boolean;
  className?: string;
}

// Focus-style ring while the popover is open. Appended after cn() for the same
// tailwind-merge reason as FOCUS_RING (see ui/lib/cn.ts).
const OPEN_RING = 'outline outline-2 outline-offset-2 outline-interactive-primary';

const COPY = {
  visible: {
    label: 'Visible to manager',
    body: 'They can see this score, transcript and comments.',
  },
  hidden: {
    label: 'Hidden from manager',
    body: "Your manager can't see this score, transcript or comments.",
  },
} as const;

/**
 * Per-feedback visibility: an eye icon button (Eye = visible, EyeOff = hidden)
 * that opens a small settings popover with a Switch. Hover shows the state in a
 * tooltip. With `readOnly` the button is a plain status indicator.
 *
 * The popover is hand-rolled (no @radix-ui/react-popover dependency): it is
 * anchored under the button, right-aligned, and closes on outside click, Esc or
 * a second click on the button, returning focus to the button.
 */
function FeedbackVisibilityControl({
  visible,
  defaultVisible = false,
  onVisibleChange,
  disabled,
  readOnly,
  className,
}: FeedbackVisibilityControlProps) {
  const [inner, setInner] = React.useState(defaultVisible);
  const [open, setOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();

  const isVisible = visible ?? inner;
  const copy = isVisible ? COPY.visible : COPY.hidden;
  const Icon = isVisible ? Eye : EyeOff;

  const close = React.useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const setVisible = (next: boolean) => {
    if (visible === undefined) setInner(next);
    onVisibleChange?.(next);
  };

  const button = (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={
        readOnly ? copy.label : `${copy.label}, visibility settings`
      }
      aria-haspopup={readOnly ? undefined : 'dialog'}
      aria-expanded={readOnly ? undefined : open}
      onClick={readOnly ? undefined : () => (open ? close() : setOpen(true))}
      className={`${cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-solid p-0 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-disabled',
        readOnly ? 'cursor-default' : 'cursor-pointer',
        isVisible
          ? 'border-interactive-primary bg-feedback-info-bg-subtle text-interactive-primary'
          : 'border-stroke bg-surface-emphasis text-content-secondary',
        !readOnly && !isVisible && 'hover:bg-surface-page',
      )} ${FOCUS_RING} ${open ? OPEN_RING : ''}`}
    >
      <Icon aria-hidden="true" size={16} />
    </button>
  );

  return (
    <div ref={rootRef} className={cn('relative inline-flex font-sans', className)}>
      <TooltipProvider delayDuration={200}>
        <Tooltip open={tooltipOpen && !open} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <DsTooltipContent>
            {copy.label}
          </DsTooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && !readOnly ? (
        <div
          role="dialog"
          aria-labelledby={titleId}
          style={{ width: 300 }}
          className="absolute right-0 top-full z-50 mt-2xs rounded-xl border border-solid border-stroke bg-surface-emphasis p-sm shadow-lg"
        >
          <div className="flex items-center justify-between gap-sm">
            <h2 id={titleId} style={{ fontSize: 15 }} className="m-0 font-bold leading-6 text-content-primary">
              {copy.label}
            </h2>
            <Switch
              checked={isVisible}
              onCheckedChange={setVisible}
              aria-labelledby={titleId}
              disabled={disabled}
            />
          </div>
          <p className="m-0 mt-3xs text-sm text-content-secondary">{copy.body}</p>
        </div>
      ) : null}
    </div>
  );
}

export { FeedbackVisibilityControl };

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn, FOCUS_RING } from '@/ui/lib/cn';

export interface FeedbackVisibilityControlProps {
  /** true = "Visible to manager", false = "Hidden from manager". */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Show the status badge next to the button. Turn off for tight spaces (icon button only). */
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

const COPY = {
  visible: { label: 'Visible to manager', action: 'Hide from manager' },
  hidden: { label: 'Hidden from manager', action: 'Make visible to manager' },
} as const;

/**
 * Per-feedback visibility: a status badge ("Visible to manager" / "Hidden from
 * manager") paired with an icon button that flips it. The badge is the readable
 * state; the button's aria-label names the action it will take, and aria-pressed
 * carries the current state for assistive tech.
 */
function FeedbackVisibilityControl({
  visible,
  defaultVisible = false,
  onVisibleChange,
  showLabel = true,
  disabled,
  className,
}: FeedbackVisibilityControlProps) {
  const [inner, setInner] = React.useState(defaultVisible);
  const isVisible = visible ?? inner;
  const copy = isVisible ? COPY.visible : COPY.hidden;
  const Icon = isVisible ? Eye : EyeOff;

  return (
    <div className={cn('inline-flex items-center gap-2xs font-sans', className)}>
      {showLabel ? (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2xs text-xs',
            isVisible ? 'bg-feedback-success-bg text-emerald-dark' : 'bg-slate-3 text-content-secondary',
          )}
        >
          {copy.label}
        </span>
      ) : null}
      <button
        type="button"
        aria-pressed={isVisible}
        aria-label={copy.action}
        title={copy.action}
        disabled={disabled}
        onClick={() => {
          if (visible === undefined) setInner(!isVisible);
          onVisibleChange?.(!isVisible);
        }}
        className={`${cn(
          'inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-solid border-stroke-button bg-surface-emphasis p-0 transition-colors',
          'hover:bg-interactive-secondary-hover active:bg-interactive-secondary-active',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          isVisible ? 'text-interactive-primary' : 'text-icon',
        )} ${FOCUS_RING}`}
      >
        <Icon aria-hidden="true" size={16} />
      </button>
    </div>
  );
}

export { FeedbackVisibilityControl };

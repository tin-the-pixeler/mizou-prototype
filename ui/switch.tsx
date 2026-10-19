import * as React from 'react';

import { cn, FOCUS_RING } from '@/ui/lib/cn';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'role'> {
  /** Controlled state. Omit to let the switch manage its own state. */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Minimal on/off switch (role="switch"). Hand-rolled instead of pulling in
 * @radix-ui/react-switch — it needs no popper/portal behaviour, just a
 * keyboard-operable button, and Space/Enter already toggle a <button>.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked = false, onCheckedChange, disabled, onClick, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultChecked);
    const isOn = checked ?? inner;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        data-state={isOn ? 'checked' : 'unchecked'}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (checked === undefined) setInner(!isOn);
          onCheckedChange?.(!isOn);
        }}
        className={`${cn(
          'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-none p-0 transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          isOn ? 'bg-interactive-primary' : 'bg-slate-7',
          className,
        )} ${FOCUS_RING}`}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            // left-offset instead of translate-x: Preflight is off in this repo, so the
            // --tw-translate-* defaults Tailwind's transform utilities rely on never load.
            'pointer-events-none absolute top-1 block size-4 rounded-full bg-white shadow-1 transition-all',
            isOn ? 'left-5' : 'left-1',
          )}
        />
      </button>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };

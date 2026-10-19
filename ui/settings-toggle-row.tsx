import * as React from 'react';

import { cn } from '@/ui/lib/cn';
import { Switch } from '@/ui/switch';

export interface SettingsToggleRowProps {
  label: string;
  /** Explanatory text shown under the label. */
  helperText?: string;
  /**
   * Chip shown beside the label that spells out the current state, e.g.
   * { on: 'On', off: 'Off' }. Omit for no chip.
   */
  statusLabels?: { on: string; off: string };
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Settings row: label (+ optional status chip) and helper text on the left, switch
 * on the right. The label is wired to the switch (aria-labelledby) and the helper
 * text is its description (aria-describedby), so screen readers announce both.
 * The chip is aria-hidden — the switch already announces its own checked state.
 */
function SettingsToggleRow({
  label,
  helperText,
  statusLabels,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
}: SettingsToggleRowProps) {
  const id = React.useId();
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;

  // The row owns the state (when uncontrolled) so the chip and switch can't disagree.
  const [inner, setInner] = React.useState(defaultChecked);
  const isOn = checked ?? inner;

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-md rounded-container border border-solid border-stroke bg-surface-emphasis p-sm font-sans',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3xs">
        <div className="flex flex-wrap items-center gap-2xs">
          <span id={labelId} className="text-base font-semibold text-content-primary">
            {label}
          </span>
          {statusLabels ? (
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex items-center rounded-full px-2xs text-xs',
                isOn ? 'bg-feedback-success-bg text-emerald-dark' : 'bg-slate-3 text-content-secondary',
              )}
            >
              {isOn ? statusLabels.on : statusLabels.off}
            </span>
          ) : null}
        </div>
        {helperText ? (
          <span id={helperId} className="text-sm text-content-secondary">
            {helperText}
          </span>
        ) : null}
      </div>
      <Switch
        aria-labelledby={labelId}
        aria-describedby={helperText ? helperId : undefined}
        checked={isOn}
        onCheckedChange={(next) => {
          if (checked === undefined) setInner(next);
          onCheckedChange?.(next);
        }}
        disabled={disabled}
      />
    </div>
  );
}

export { SettingsToggleRow };

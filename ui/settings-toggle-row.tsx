import * as React from 'react';

import { cn } from '@/ui/lib/cn';
import { Switch } from '@/ui/switch';

export interface SettingsToggleRowProps {
  label: string;
  /** Explanatory text shown under the label. */
  helperText?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Settings row: label + helper text on the left, switch on the right.
 * The label is wired to the switch (aria-labelledby) and the helper text is its
 * description (aria-describedby), so screen readers announce both.
 */
function SettingsToggleRow({
  label,
  helperText,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
}: SettingsToggleRowProps) {
  const id = React.useId();
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-md rounded-container border border-solid border-stroke bg-surface-emphasis p-sm font-sans',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3xs">
        <span id={labelId} className="text-base font-semibold text-content-primary">
          {label}
        </span>
        {helperText ? (
          <span id={helperId} className="text-sm text-content-secondary">
            {helperText}
          </span>
        ) : null}
      </div>
      <Switch
        aria-labelledby={labelId}
        aria-describedby={helperText ? helperId : undefined}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

export { SettingsToggleRow };

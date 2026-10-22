import * as React from 'react';
import { Upload } from 'lucide-react';

import { cn, FOCUS_RING } from '@/ui/lib/cn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';

export interface FeedbackExportButtonProps {
  onClick?: () => void;
  className?: string;
}

/** Round 36px icon button that exports the feedback. Direct action — no menu. */
function FeedbackExportButton({ onClick, className }: FeedbackExportButtonProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Export feedback"
            onClick={onClick}
            className={`${cn(
              'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-stroke bg-surface-emphasis p-0 text-content-secondary transition-colors hover:bg-surface-page',
              className,
            )} ${FOCUS_RING}`}
          >
            <Upload aria-hidden="true" size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-none bg-content-primary px-2xs py-3xs text-xs text-content-inverse"
        >
          Export
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { FeedbackExportButton };

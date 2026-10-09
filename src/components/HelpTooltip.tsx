import { Tooltip } from "@base-ui/react/tooltip";
import { CircleHelp } from "lucide-react";
import { useId } from "react";

interface HelpTooltipProps {
  label: string;
  children: string;
}

export function HelpTooltip({ label, children }: HelpTooltipProps) {
  const descriptionId = useId();
  return (
    <Tooltip.Provider delay={300}>
      <Tooltip.Root>
        <Tooltip.Trigger
          aria-label={label}
          aria-describedby={descriptionId}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
        >
          <CircleHelp aria-hidden="true" className="size-4" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8} className="z-50">
            <Tooltip.Popup id={descriptionId} role="tooltip" className="max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-[#44404f] bg-[#30283f] px-3 py-2 text-sm leading-relaxed text-[#f0ede8] shadow-md">
              {children}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

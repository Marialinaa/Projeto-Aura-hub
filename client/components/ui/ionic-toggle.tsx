import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface IonicToggleProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  enableOnOffLabels?: boolean;
  children?: React.ReactNode;
}

const IonicToggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  IonicToggleProps
>(({ className, enableOnOffLabels = false, children, checked, ...props }, ref) => (
  <div className="flex items-center space-x-3">
    {children && (
      <span className="text-sm font-medium text-gray-700">
        {children}
      </span>
    )}
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative",
        checked 
          ? "bg-green-500 shadow-lg" 
          : "bg-gray-300",
        className,
      )}
      checked={checked}
      {...props}
      ref={ref}
    >
      {enableOnOffLabels && (
        <>
          <span 
            className={cn(
              "absolute left-1.5 text-[10px] font-bold transition-opacity duration-200",
              checked ? "text-white opacity-100" : "text-gray-600 opacity-0"
            )}
          >
            ON
          </span>
          <span 
            className={cn(
              "absolute right-1.5 text-[10px] font-bold transition-opacity duration-200",
              checked ? "text-white opacity-0" : "text-gray-600 opacity-100"
            )}
          >
            OFF
          </span>
        </>
      )}
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 z-10",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  </div>
));

IonicToggle.displayName = "IonicToggle";

export { IonicToggle };

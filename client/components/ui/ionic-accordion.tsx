import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IonicAccordionProps {
  children: React.ReactNode;
  expand?: "inset" | "compact";
  className?: string;
}

interface IonicAccordionItemProps {
  value: string;
  children: React.ReactNode;
  headerColor?: "light" | "medium" | "dark";
  className?: string;
}

interface IonicAccordionHeaderProps {
  children: React.ReactNode;
  color?: "light" | "medium" | "dark";
  className?: string;
}

interface IonicAccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const IonicAccordionGroup = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  IonicAccordionProps
>(({ className, expand = "inset", children, ...props }, ref) => (
  <AccordionPrimitive.Root
    type="single"
    collapsible
    className={cn(
      "w-full space-y-2",
      expand === "inset" && "rounded-lg border border-gray-200 overflow-hidden",
      expand === "compact" && "space-y-1",
      className
    )}
    {...props}
    ref={ref}
  >
    {children}
  </AccordionPrimitive.Root>
));

const IonicAccordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  IonicAccordionItemProps
>(({ className, value, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-gray-200 last:border-b-0",
      className
    )}
    value={value}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
));

const IonicAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  IonicAccordionHeaderProps
>(({ className, color = "light", children, ...props }, ref) => {
  const colorClasses = {
    light: "bg-gray-50 hover:bg-gray-100 text-gray-800",
    medium: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    dark: "bg-gray-800 hover:bg-gray-700 text-white",
  };

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between px-4 py-4 text-left text-sm font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          colorClasses[color],
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-3">
          {children}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

const IonicAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  IonicAccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("p-4 pt-0 bg-white", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));

// Componente de item completo estilo Ionic
interface IonicItemProps {
  children: React.ReactNode;
  color?: "light" | "medium" | "dark";
  className?: string;
}

const IonicItem: React.FC<IonicItemProps> = ({ children, color = "light", className }) => {
  const colorClasses = {
    light: "bg-gray-50 text-gray-800",
    medium: "bg-gray-200 text-gray-900", 
    dark: "bg-gray-800 text-white",
  };

  return (
    <div className={cn(
      "flex items-center px-4 py-3 min-h-[48px]",
      colorClasses[color],
      className
    )}>
      {children}
    </div>
  );
};

const IonicLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cn("flex-1 text-sm font-medium", className)}>
    {children}
  </span>
);

IonicAccordionGroup.displayName = "IonicAccordionGroup";
IonicAccordion.displayName = "IonicAccordion";
IonicAccordionTrigger.displayName = "IonicAccordionTrigger";
IonicAccordionContent.displayName = "IonicAccordionContent";

export { 
  IonicAccordionGroup, 
  IonicAccordion, 
  IonicAccordionTrigger, 
  IonicAccordionContent,
  IonicItem,
  IonicLabel
};

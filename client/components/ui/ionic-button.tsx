import * as React from "react";
import { cn } from "@/lib/utils";

interface IonicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "clear" | "fill";
  size?: "small" | "default" | "large";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

const IonicButton = React.forwardRef<HTMLButtonElement, IonicButtonProps>(
  ({ className, variant = "default", size = "default", color = "primary", disabled, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none rounded-lg";
    
    const sizeClasses = {
      small: "h-8 px-3 text-sm",
      default: "h-11 px-4 text-base",
      large: "h-14 px-6 text-lg",
    };

    const variantClasses = {
      default: {
        primary: disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg",
        secondary: disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 shadow-md hover:shadow-lg",
        success: disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg",
        warning: disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 shadow-md hover:shadow-lg",
        danger: disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg",
      },
      outline: {
        primary: disabled 
          ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed" 
          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
        secondary: disabled 
          ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed" 
          : "border-2 border-gray-600 text-gray-600 hover:bg-gray-50 active:bg-gray-100",
        success: disabled 
          ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed" 
          : "border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100",
        warning: disabled 
          ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed" 
          : "border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100",
        danger: disabled 
          ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed" 
          : "border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100",
      },
      clear: {
        primary: disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-blue-600 hover:bg-blue-50 active:bg-blue-100",
        secondary: disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-gray-600 hover:bg-gray-50 active:bg-gray-100",
        success: disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-green-600 hover:bg-green-50 active:bg-green-100",
        warning: disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100",
        danger: disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "text-red-600 hover:bg-red-50 active:bg-red-100",
      },
      fill: {
        primary: disabled 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300",
        secondary: disabled 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
        success: disabled 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300",
        warning: disabled 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300",
        danger: disabled 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300",
      },
    };

    return (
      <button
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant][color],
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IonicButton.displayName = "IonicButton";

export { IonicButton };

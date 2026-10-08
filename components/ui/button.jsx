"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-orange-500/20 shadow-md",
  secondary:
    "bg-orange-50 text-orange-700 hover:bg-orange-100 active:bg-orange-200 border border-orange-200/60",
  outline:
    "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 hover:border-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  destructive:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
};

const sizes = {
  sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
  md: "h-11 px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 py-3 text-base rounded-xl gap-2.5 font-semibold",
  icon: "h-11 w-11 rounded-xl justify-center p-0",
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out cursor-pointer select-none focus-ring disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin ms-2" />
          <span>تکایە چاوەڕێبە...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

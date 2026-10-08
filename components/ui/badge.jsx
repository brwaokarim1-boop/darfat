import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  primary: "bg-orange-50 text-orange-700 border-orange-200/80 font-medium",
  match: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm font-semibold border-transparent",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  outline: "bg-transparent text-slate-600 border-slate-300",
};

export function Badge({
  className,
  variant = "default",
  dot = false,
  dotColor = "bg-orange-500",
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border transition-colors",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full ms-1.5 animate-pulse", dotColor)}
        />
      )}
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

export function Card({ className, hover = false, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 text-slate-900 shadow-sm transition-all duration-200",
        hover && "hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-bold tracking-tight text-slate-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-slate-500 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("pt-1", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-slate-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

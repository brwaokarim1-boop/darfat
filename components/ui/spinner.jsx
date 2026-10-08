import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md", text = "بارکردن..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3 text-slate-500">
      <Loader2
        className={cn("animate-spin text-orange-500", sizeClasses[size] || sizeClasses.md, className)}
      />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}

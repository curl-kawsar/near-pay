import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/60 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

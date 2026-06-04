import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700",
  secondary:
    "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  outline:
    "border border-teal-200 text-teal-700 bg-white hover:bg-teal-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

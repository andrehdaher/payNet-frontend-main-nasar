import React from "react";

// دالة بسيطة لدمج الكلاسات
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", loading = false, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

    const variants = {
      default: "bg-violet-700 text-white shadow-sm hover:bg-violet-800",
      accent: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
      success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      warning: "bg-amber-500 text-white shadow-sm hover:bg-amber-600",
      outline: "border border-slate-300 bg-white text-slate-800 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "text-slate-700 hover:bg-slate-100",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

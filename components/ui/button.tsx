import * as React from "react";
import { cn } from "@/lib/utils";

// s: minimal shadcn-like button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90",
      secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
      ghost: "hover:bg-accent",
      outline: "border border-border bg-background hover:bg-accent",
      destructive: "bg-destructive text-white hover:opacity-90",
    } as const;
    const sizes = {
      sm: "h-8 px-2 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-10 px-4 text-sm",
      icon: "h-9 w-9 p-0",
    } as const;
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";



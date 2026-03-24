import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold",
          "ring-offset-background transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-40",
          "active:scale-[0.97]",
          "cursor-pointer",
          // Variants
          {
            // PRIMARY — solid bold CTA
            "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-px":
              variant === "default",
            // SECONDARY — subtle fill
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            // OUTLINE — bordered, no fill
            "border border-border bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20":
              variant === "outline",
            // GHOST — invisible until hovered
            "text-foreground hover:bg-accent hover:text-accent-foreground":
              variant === "ghost",
            // DESTRUCTIVE — danger action
            "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 hover:bg-destructive/85":
              variant === "destructive",
            // LINK — text-only
            "text-primary underline-offset-4 hover:underline p-0 h-auto":
              variant === "link",
            // GLASS — premium glassmorphism
            "glass text-foreground border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl":
              variant === "glass",
          },
          // Sizes
          {
            "h-11 px-6 py-2.5": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-13 rounded-xl px-10 text-base": size === "lg",
            "h-11 w-11 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

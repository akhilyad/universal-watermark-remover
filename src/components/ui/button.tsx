import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[3px] text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] active:scale-[0.99] font-medium transition-all duration-150 shadow-none",
        primary:
          "bg-[#000000] text-[#FFFFFF] hover:bg-[#222222] active:scale-[0.99] font-semibold transition-all duration-150 shadow-none",
        destructive:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.99]",
        outline:
          "border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F4F4F5] hover:border-[#111111] text-[#111111] active:scale-[0.99]",
        secondary:
          "bg-[#F4F4F5] text-[#111111] hover:bg-[#E4E4E7] border border-[#E5E5E5] active:scale-[0.99]",
        ghost:
          "hover:bg-[#F4F4F5] hover:text-[#111111] text-[#555555] active:scale-[0.99]",
        link: "text-[#111111] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3.5 py-1.5 text-xs",
        sm: "h-7 rounded-[3px] px-2.5 text-[11px]",
        lg: "h-9 rounded-[3px] px-5 text-xs font-semibold tracking-tight",
        icon: "h-7 w-7",
        xs: "h-6 px-2 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

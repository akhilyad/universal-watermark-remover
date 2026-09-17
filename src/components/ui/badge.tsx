import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[10px] font-mono transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#111111] text-[#FFFFFF]",
        secondary:
          "border-[#E5E5E5] bg-[#F4F4F5] text-[#111111]",
        destructive:
          "border-red-200 bg-red-50 text-red-700",
        outline: "border-[#E5E5E5] text-[#555555] bg-[#FFFFFF]",
        mono: "border-[#E5E5E5] bg-[#FAFAFA] text-[#333333] font-normal tracking-tight",
        success: "border-[#E5E5E5] bg-[#F4F4F5] text-[#111111] font-mono",
        warning: "border-amber-200 bg-amber-50 text-amber-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

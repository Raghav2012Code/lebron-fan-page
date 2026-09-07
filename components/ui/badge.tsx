import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border font-mono text-[0.625rem] uppercase tracking-[0.22em] px-2.5 py-1 w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-hairline text-muted",
        gold: "border-gold/50 text-gold",
        red: "border-red/50 text-red",
        solid: "border-transparent bg-gold text-ink",
        paper: "border-paper/40 text-paper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

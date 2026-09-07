import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase tracking-[0.18em] text-xs transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gold text-ink hover:bg-gold-bright active:bg-gold-bright",
        solid:
          "bg-paper text-ink hover:bg-white",
        outline:
          "border border-hairline-strong bg-transparent text-paper hover:border-gold hover:text-gold",
        ghost:
          "bg-transparent text-muted hover:text-paper",
        danger:
          "bg-red text-paper hover:brightness-110",
        link: "text-gold underline-offset-4 hover:underline p-0 h-auto tracking-normal",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[0.6875rem]",
        lg: "h-14 px-9 text-sm",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

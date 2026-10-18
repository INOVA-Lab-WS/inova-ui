import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./button";
import { cn } from "../lib/cn";

export interface SeeAllProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** A single router Link child receives the link styles and trailing arrow. */
  asChild?: boolean;
}

/** Section action link, ready for PageHeader action, with an independent router Link slot. */
export const SeeAll = React.forwardRef<HTMLAnchorElement, SeeAllProps>(({ asChild, children, className, ...props }, ref) => {
  const classes = cn(buttonVariants({ variant: "ghost", size: "compact" }), "h-auto rounded-4 px-0 py-1 text-sm lg:h-auto hover:bg-transparent hover:underline", className);
  const arrow = <ArrowRight aria-hidden="true" className="size-4" />;
  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) throw new Error("SeeAll asChild requires one router Link element.");
    return <Slot ref={ref} className={classes} {...props}>{React.cloneElement(child, undefined, <>{child.props.children ?? "Ver todos"}{arrow}</>)}</Slot>;
  }
  return <a ref={ref} className={classes} {...props}>{children ?? "Ver todos"}{arrow}</a>;
});
SeeAll.displayName = "SeeAll";

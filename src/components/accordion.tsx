import * as React from "react";
import * as Primitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Accordion · Figma "accordion". Sections that open and close; the content is a free slot. Items stack with gap 8.
 * The trigger has the button states: default, hover, pressed, disabled (pass `disabled` to the item) and focus.
 */
export const Accordion = React.forwardRef<
  React.ElementRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root>
>(({ className, ...props }, ref) => <Primitive.Root ref={ref} className={cn("flex flex-col gap-2 font-sans", className)} {...props} />);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.Item>, "title"> {
  title: React.ReactNode;
  /** Supporting text under the title (12px). */
  subtitle?: React.ReactNode;
}

export const AccordionItem = React.forwardRef<React.ElementRef<typeof Primitive.Item>, AccordionItemProps>(
  ({ className, title, subtitle, children, ...props }, ref) => (
    <Primitive.Item
      ref={ref}
      className={cn(
        "overflow-hidden rounded-16 border border-border-default bg-surface-card transition-colors",
        // hover and pressed color the whole card, like the library
        "has-[button:hover:not(:disabled)]:bg-surface-control-hover has-[button:active:not(:disabled)]:bg-chip-pressed",
        // focus ring outside the card, like the button
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text-primary",
        className,
      )}
      {...props}
    >
      <Primitive.Header className="m-0">
        <Primitive.Trigger
          className={cn(
            "group flex w-full items-center gap-3 p-4 text-left outline-none",
            "disabled:pointer-events-none",
          )}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-semibold text-text-primary group-disabled:text-text-disabled">{title}</span>
            {subtitle && <span className="text-xs text-text-muted group-disabled:text-text-disabled">{subtitle}</span>}
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-text-muted transition-transform group-disabled:text-text-disabled group-data-[state=open]:rotate-180" />
        </Primitive.Trigger>
      </Primitive.Header>
      <Primitive.Content className="flex flex-col gap-2 px-4 pb-4 text-sm text-text-primary">{children}</Primitive.Content>
    </Primitive.Item>
  ),
);
AccordionItem.displayName = "AccordionItem";

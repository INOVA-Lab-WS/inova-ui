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
  /** Keep the content mounted while closed (hidden), so form fields inside still submit. */
  keepMounted?: boolean;
}

export const AccordionItem = React.forwardRef<React.ElementRef<typeof Primitive.Item>, AccordionItemProps>(
  ({ className, title, subtitle, keepMounted, children, ...props }, ref) => (
    <Primitive.Item
      ref={ref}
      className={cn(
        "overflow-hidden rounded-16 border border-border-default bg-surface-card transition-colors",
        // hover, pressed and focus react to the item's own trigger only, never to buttons or fields inside the content
        "has-[>h3>button:hover:not(:disabled)]:bg-surface-muted has-[>h3>button:active:not(:disabled)]:bg-surface-selected",
        "has-[>h3>button:focus-visible]:outline-2 has-[>h3>button:focus-visible]:outline-offset-2 has-[>h3>button:focus-visible]:outline-text-primary",
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
      <Primitive.Content
        forceMount={keepMounted ? true : undefined}
        className="flex flex-col gap-2 px-4 pb-4 text-sm text-text-primary data-[state=closed]:hidden"
      >
        {children}
      </Primitive.Content>
    </Primitive.Item>
  ),
);
AccordionItem.displayName = "AccordionItem";

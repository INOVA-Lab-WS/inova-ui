import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Package, User } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Avatar · Figma "avatar". A person (initial, icon or the photo they uploaded) or, with variant="app", an app or
 * service: its logo on white with a 1px border, and a grey package icon when there is no logo. Small 24, medium 36, large 56.
 */
export const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border-default bg-surface-ink font-sans font-semibold text-text-on-ink",
  {
    variants: {
      variant: {
        person: "",
        app: "bg-surface-card text-text-muted [&_img]:object-contain [&_img]:p-1",
      },
      size: {
        small: "size-6 text-xs [&_svg]:size-3",
        medium: "size-9 text-base [&_svg]:size-5",
        large: "size-14 text-lg [&_svg]:size-7",
      },
    },
    defaultVariants: { variant: "person", size: "medium" },
  },
);

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  /** Name used for the initial and the accessible label. Without it, the icon variant renders. */
  name?: string;
  /** Person: only a photo they uploaded to the app, never the login provider's; falls back to the initial.
   *  App: the logo; falls back to the package icon. */
  src?: string;
  icon?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(({ className, variant, size, name, src, icon, ...props }, ref) => {
  const app = variant === "app";
  // A photo the person uploaded; if it is missing or fails to load, the initial takes its place.
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  return (
    <span ref={ref} role="img" aria-label={name ?? (app ? "App" : "Usuário")} className={cn(avatarVariants({ variant, size }), className)} {...props}>
      {src && !failed ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : app ? (
        (icon ?? <Package aria-hidden />)
      ) : icon ? (
        icon
      ) : name ? (
        name.trim().charAt(0).toUpperCase()
      ) : (
        <User aria-hidden />
      )}
    </span>
  );
});
Avatar.displayName = "Avatar";

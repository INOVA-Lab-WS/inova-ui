import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { User } from "lucide-react";
import { cn } from "../lib/cn";

/** Avatar · Figma "avatar". Initial or icon; small 24, medium 36, large 56. */
export const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border-default bg-surface-ink font-sans font-semibold text-text-on-ink",
  {
    variants: {
      size: {
        small: "size-6 text-xs [&_svg]:size-3",
        medium: "size-9 text-base [&_svg]:size-5",
        large: "size-14 text-lg [&_svg]:size-7",
      },
    },
    defaultVariants: { size: "medium" },
  },
);

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  /** Name used for the initial and the accessible label. Without it, the icon variant renders. */
  name?: string;
  /** Only a photo the person uploaded to the app; never the identity provider's photo. Falls back to the initial. */
  src?: string;
  icon?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(({ className, size, name, src, icon, ...props }, ref) => {
  // A photo the person uploaded; if it is missing or fails to load, the initial takes its place.
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  return (
    <span ref={ref} role="img" aria-label={name ?? "Usuário"} className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !failed ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : name ? (
        name.trim().charAt(0).toUpperCase()
      ) : (
        (icon ?? <User aria-hidden />)
      )}
    </span>
  );
});
Avatar.displayName = "Avatar";

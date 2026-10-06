import * as React from "react";
import { cn } from "../lib/cn";
import { logoData } from "./logos-data";

/** Renders one exported logo, suffixing every id so two instances on a page never share a clipPath or filter. */
function useLogoSvg(key: string) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return React.useMemo(() => {
    const data = logoData[key];
    if (!data) return null;
    const ids = Array.from(data.body.matchAll(/id="([^"]+)"/g), (m) => m[1]);
    let body = data.body;
    for (const id of ids) body = body.split(`#${id})`).join(`#${id}_${uid})`).split(`id="${id}"`).join(`id="${id}_${uid}"`);
    return { viewBox: data.viewBox, body };
  }, [key, uid]);
}

interface BaseLogoProps extends Omit<React.SVGAttributes<SVGSVGElement>, "type" | "color"> {
  /** Accessible name; omit to mark the logo decorative. */
  title?: string;
}

// Default heights from the library: the symbol fills the 20px logo slot of the rail and the header;
// wordmark and mark sit at 14px, as in the header. Width follows the drawing. Override with className.
const logoHeight = (type: string) => (type === "symbol" ? "h-5 w-auto" : "h-3.5 w-auto");

function LogoSvg({ name, title, className, size, ...props }: BaseLogoProps & { name: string; size: string }) {
  const svg = useLogoSvg(name);
  if (!svg) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={svg.viewBox}
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("block shrink-0", size, className)}
      dangerouslySetInnerHTML={{ __html: svg.body }}
      {...props}
    />
  );
}

/** Logo AmbientAI · Figma "logo-ambientai". */
export interface LogoAmbientAIProps extends BaseLogoProps {
  type?: "symbol" | "wordmark" | "mark";
  color?: "black" | "green" | "white";
}
export function LogoAmbientAI({ type = "wordmark", color = "black", ...props }: LogoAmbientAIProps) {
  const c = type === "symbol" ? (color === "green" ? "green" : "black") : color === "white" ? "white" : "black";
  return <LogoSvg name={`ambientai-${type}-${c}`} size={logoHeight(type)} {...props} />;
}

/** Logo Gate · Figma "logo-gate". */
export interface LogoGateProps extends BaseLogoProps {
  type?: "symbol" | "wordmark" | "mark";
  color?: "black" | "green" | "white";
}
export function LogoGate({ type = "wordmark", color = "black", ...props }: LogoGateProps) {
  const c =
    type === "symbol" ? (color === "green" ? "green" : "black") : type === "mark" ? (color === "white" ? "white" : "black") : color;
  return <LogoSvg name={`gate-${type}-${c}`} size={logoHeight(type)} {...props} />;
}

/** Logo Forma Lab · Figma "logo-forma-lab". The symbol only exists in lime. */
export interface LogoFormaLabProps extends BaseLogoProps {
  type?: "symbol" | "wordmark" | "mark";
  color?: "lime" | "black" | "white";
}
export function LogoFormaLab({ type = "wordmark", color = "black", ...props }: LogoFormaLabProps) {
  const c = type === "symbol" ? "lime" : color === "white" ? "white" : "black";
  return <LogoSvg name={`forma-lab-${type}-${c}`} size={logoHeight(type)} {...props} />;
}

/** Logo INOVA UI · Figma "logo-inova-ui". Symbol in lime. */
export function LogoInovaUI(props: BaseLogoProps) {
  return <LogoSvg name="inova-ui-symbol-lime" size={logoHeight("symbol")} {...props} />;
}

/** Logo placeholder · Figma "logo-placeholder". 96x24 slot marker for a product logo still to come. */
export const LogoPlaceholder = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children = "Logo", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex h-6 w-24 items-center justify-center rounded-4 bg-surface-muted font-sans text-xs font-semibold text-text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);
LogoPlaceholder.displayName = "LogoPlaceholder";

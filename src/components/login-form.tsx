import * as React from "react";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";

/**
 * LoginForm · Figma "login-form". Identifier (LDAP or e-mail) + "Iniciar".
 * viewport mobile: glass card over the hero photo; desktop: white card inline.
 * state is driven by props: value, error/notice, loading, onRetry.
 * Identity (#93, Figma state=identity): after a verified sign-in (PingID), `identity` replaces the field with the person:
 * avatar (their photo when `avatarSrc`, else the initial in ink), name and e-mail; the button stays where it is (beside
 * on desktop, below on mobile), labelled by `submitLabel`. On mobile the glass surface stays, name and e-mail in white.
 * The label above shows only when `label` is passed. `alert` sits above everything (e.g. an info Alert).
 */
export interface LoginFormIdentity {
  name: string;
  email?: string;
  /** Photo of the person; without it, the initial. */
  avatarSrc?: string;
}

export interface LoginFormProps {
  viewport?: "mobile" | "desktop";
  /** Identifier typed by the person. Not used with `identity`. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Verified person (#93): replaces the field; the button submits without typing. */
  identity?: LoginFormIdentity;
  /** Button text (default "Iniciar"; e.g. "Entrar" with identity). */
  submitLabel?: React.ReactNode;
  /** Disables the button (e.g. while something else is pending). */
  disabled?: boolean;
  /** Content above the form, e.g. <Alert tone="info" />. */
  alert?: React.ReactNode;
  onSubmit: () => void;
  loading?: boolean;
  error?: React.ReactNode;
  notice?: React.ReactNode;
  onRetry?: () => void;
  label?: React.ReactNode;
  placeholder?: string;
  help?: React.ReactNode;
  className?: string;
}

export function LoginForm({
  viewport = "mobile",
  value = "",
  onValueChange,
  onSubmit,
  identity,
  submitLabel = "Iniciar",
  disabled,
  alert,
  loading,
  error,
  notice,
  onRetry,
  label: labelProp,
  placeholder = "LDAP ou e-mail corporativo",
  help,
  className,
}: LoginFormProps) {
  const mobile = viewport === "mobile";
  const label = labelProp ?? (identity ? undefined : "Identifique-se para começar");
  const ready = (identity ? true : value.trim().length > 0) && !loading && !disabled;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit();
      }}
      className={cn(
        "flex flex-col gap-3 font-sans",
        mobile
          ? "rounded-24 border border-border-glass bg-surface-glass px-4 pt-5 pb-5 text-text-on-ink backdrop-blur-[12px]"
          : "rounded-16 border border-border-default bg-surface-card p-4 text-text-primary",
        className,
      )}
    >
      {alert}
      {identity && label && <p className={cn("text-sm font-medium", mobile ? "text-text-on-ink" : "text-text-primary")}>{label}</p>}
      <div className={cn("flex gap-3", mobile ? "flex-col" : identity ? "flex-row items-center" : "flex-row items-end")}>
        {identity ? (
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-3",
              mobile ? "h-14" : "h-12 rounded-12 bg-surface-card px-3",
            )}
          >
            <Avatar name={identity.name} src={identity.avatarSrc} size="medium" aria-hidden />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={cn("truncate text-sm font-semibold", mobile ? "text-text-on-ink" : "text-text-primary")}>{identity.name}</span>
              {identity.email && <span className={cn("truncate text-xs", mobile ? "text-text-on-ink" : "text-text-muted")}>{identity.email}</span>}
            </span>
          </div>
        ) : (
          <Input
            label={label && <span className={mobile ? "text-text-on-ink" : undefined}>{label}</span>}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={placeholder}
            autoComplete="username"
            error={error}
            leftIcon={<Search aria-hidden />}
            rightIcon={
              value ? (
                <button type="button" aria-label="Limpar" onClick={() => onValueChange?.("")} className="inline-flex">
                  <X aria-hidden />
                </button>
              ) : undefined
            }
            containerClassName="flex-1"
          />
        )}
        <Button type="submit" disabled={!ready} className={mobile ? "w-full" : undefined}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Carregando…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
      {identity && error && <p role="alert" className={cn("text-xs", mobile ? "text-text-on-ink" : "text-surface-danger")}>{error}</p>}
      {(notice || help) && <p className={cn("text-xs", mobile ? "text-center text-text-on-ink" : "text-text-muted")}>{notice ?? help}</p>}
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry} className="self-center">
          Tentar de novo
        </Button>
      )}
    </form>
  );
}

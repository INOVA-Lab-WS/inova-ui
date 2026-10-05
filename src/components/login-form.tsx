import * as React from "react";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Input } from "./input";

/**
 * LoginForm · Figma "login-form". Identifier (LDAP or e-mail) + "Iniciar".
 * viewport mobile: glass card over the hero photo; desktop: white card inline.
 * state is driven by props: value, error/notice, loading, onRetry.
 */
export interface LoginFormProps {
  viewport?: "mobile" | "desktop";
  value: string;
  onValueChange: (value: string) => void;
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
  value,
  onValueChange,
  onSubmit,
  loading,
  error,
  notice,
  onRetry,
  label = "Identifique-se para começar",
  placeholder = "LDAP ou e-mail corporativo",
  help,
  className,
}: LoginFormProps) {
  const mobile = viewport === "mobile";
  const ready = value.trim().length > 0 && !loading;
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
      <div className={cn("flex gap-3", mobile ? "flex-col" : "flex-row items-end")}>
        <Input
          label={<span className={mobile ? "text-text-on-ink" : undefined}>{label}</span>}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="username"
          error={error}
          leftIcon={<Search aria-hidden />}
          rightIcon={
            value ? (
              <button type="button" aria-label="Limpar" onClick={() => onValueChange("")} className="inline-flex">
                <X aria-hidden />
              </button>
            ) : undefined
          }
          containerClassName="flex-1"
        />
        <Button type="submit" disabled={!ready} className={mobile ? "w-full" : undefined}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Carregando…
            </>
          ) : (
            "Iniciar"
          )}
        </Button>
      </div>
      {(notice || help) && <p className={cn("text-xs", mobile ? "text-center text-text-on-ink" : "text-text-muted")}>{notice ?? help}</p>}
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry} className="self-center">
          Tentar de novo
        </Button>
      )}
    </form>
  );
}

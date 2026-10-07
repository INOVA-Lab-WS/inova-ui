import * as React from "react";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Toast · Figma "toast". Same look as Alert plus a shadow.
 * Mobile: full width minus 12px each side, 12px below the notch safe area. Desktop: top center, 16px from the top.
 * Render it inside <ToastViewport/> so it gets the position.
 */
const KIND = {
  success: { Icon: CircleCheck, cls: "bg-status-success-bg [&_svg]:text-status-success-fg" },
  error: { Icon: CircleX, cls: "bg-status-error-bg [&_svg]:text-status-error-fg" },
  info: { Icon: Info, cls: "bg-status-info-bg [&_svg]:text-status-info-fg" },
} as const;

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: keyof typeof KIND;
}

export function Toast({ kind = "success", children, className, ...props }: ToastProps) {
  const { Icon, cls } = KIND[kind];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-16 p-3 font-sans text-sm font-medium text-text-primary",
        "shadow-raised",
        cls,
        className,
      )}
      {...props}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-3 top-[calc(var(--inova-safe-area-top)+12px)] z-toast flex flex-col items-stretch gap-2",
        "lg:inset-x-0 lg:top-4 lg:items-center",
        className,
      )}
      {...props}
    />
  );
}

/**
 * ToastProvider + useToast · the queue (#50). useToast().show({ kind, message, duration? }) returns an id;
 * dismiss(id) closes it. Up to `max` toasts show at once (default 3), oldest leaving first. Default duration is the
 * motion.duration.toast-visible token; errors stay until closed unless a duration is given. The clock pauses while
 * the pointer is over a toast or it has focus; clicking or tapping a toast closes it. Enter and exit use the motion
 * tokens and do not animate with reduced motion. Outside the provider, show() does nothing.
 */
type ToastKind = keyof typeof KIND;
export interface ToastOptions {
  kind?: ToastKind;
  message: React.ReactNode;
  /** ms; null keeps it until closed. Default: toast-visible token (errors: null). */
  duration?: number | null;
}
interface ToastItem extends Required<Omit<ToastOptions, "duration">> {
  id: number;
  duration: number | null;
  leaving: boolean;
}
interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastApi>({ show: () => -1, dismiss: () => {} });
export const useToast = () => React.useContext(ToastContext);

const tokenMs = (name: string, fallback: number) => {
  if (typeof window === "undefined") return fallback;
  // CSS minifiers may rewrite 2600ms as 2.6s: read both units.
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const v = parseFloat(raw);
  if (!Number.isFinite(v)) return fallback;
  return raw.endsWith("ms") ? v : raw.endsWith("s") ? v * 1000 : v;
};

function QueuedToast({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }) {
  const timer = React.useRef<number | undefined>(undefined);
  const left = React.useRef(item.duration);
  const started = React.useRef(0);
  const start = () => {
    if (left.current === null) return;
    started.current = Date.now();
    timer.current = window.setTimeout(() => onDone(item.id), left.current);
  };
  const pause = () => {
    if (left.current === null) return;
    window.clearTimeout(timer.current);
    left.current = Math.max(0, left.current - (Date.now() - started.current));
  };
  React.useEffect(() => {
    start();
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Toast
      kind={item.kind}
      tabIndex={0}
      onPointerEnter={pause}
      onPointerLeave={start}
      onFocus={pause}
      onBlur={start}
      onClick={() => onDone(item.id)}
      className={cn(
        "cursor-pointer motion-reduce:animate-none",
        item.leaving
          ? "animate-[inova-fade-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)_forwards]"
          : "animate-[inova-dialog-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)]",
      )}
    >
      {item.message}
    </Toast>
  );
}

export function ToastProvider({ children, max = 3 }: { children?: React.ReactNode; max?: number }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(1);
  const remove = React.useCallback((id: number) => {
    setItems((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setItems((all) => all.filter((t) => t.id !== id)), tokenMs("--inova-motion-duration-exit", 200));
  }, []);
  const api = React.useMemo<ToastApi>(
    () => ({
      show: ({ kind = "success", message, duration }) => {
        const id = nextId.current++;
        const d = duration !== undefined ? duration : kind === "error" ? null : tokenMs("--inova-motion-duration-toast-visible", 2600);
        setItems((all) => {
          const live = all.filter((t) => !t.leaving);
          const overflow = live.length + 1 - max;
          const leaving = new Set(live.slice(0, Math.max(0, overflow)).map((t) => t.id));
          leaving.forEach((lid) => window.setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== lid)), tokenMs("--inova-motion-duration-exit", 200)));
          return [...all.map((t) => (leaving.has(t.id) ? { ...t, leaving: true } : t)), { id, kind, message, duration: d, leaving: false }];
        });
        return id;
      },
      dismiss: remove,
    }),
    [max, remove],
  );
  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport>
        {items.map((item) => (
          <QueuedToast key={item.id} item={item} onDone={remove} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

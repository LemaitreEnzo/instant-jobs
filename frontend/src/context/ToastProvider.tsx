import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Toast from "../components/ui/Toast/Toast";
import type { ToastItem, ToastOptions } from "../types/props.type";
import { ToastContext, type ToastFunction } from "./ToastContext";

interface ToastElementProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

/** Individual toast wrapper controlling auto-dismiss timers, pause-on-hover, and exit transitions. */
const ToastElement = ({ item, onDismiss }: ToastElementProps) => {
  const [isLocalExiting, setIsLocalExiting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const duration = item.duration ?? 4000;
  const remainingRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(0);

  const isExiting = isLocalExiting || Boolean(item.isExiting);

  const startTimer = useCallback(
    (time: number) => {
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        setIsLocalExiting(true);
        window.setTimeout(() => {
          onDismiss(item.id);
        }, 300);
      }, time);
    },
    [item.id, onDismiss],
  );

  useEffect(() => {
    startTimer(remainingRef.current);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [startTimer]);

  const handleMouseEnter = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startTimeRef.current),
      );
    }
  };

  const handleMouseLeave = () => {
    if (!isExiting && remainingRef.current > 0) {
      startTimer(remainingRef.current);
    }
  };

  const handleClose = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLocalExiting(true);
    window.setTimeout(() => {
      onDismiss(item.id);
    }, 300);
  };

  return (
    <Toast
      id={item.id}
      title={item.title}
      description={item.description}
      className={item.type}
      customClassName={item.customClassName}
      isExiting={isExiting}
      onClose={handleClose}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

/** Global provider managing the toast notification queue and portal rendering into document.body. */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t)),
    );
    window.setTimeout(() => {
      removeToast(id);
    }, 300);
  }, [removeToast]);

  const showToast = useCallback((options: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = {
      ...options,
      id,
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const toastFunction: ToastFunction = useMemo(() => {
    return Object.assign(
      (options: ToastOptions) => showToast(options),
      {
        success: (
          title: string,
          description?: string,
          options?: Omit<ToastOptions, "title" | "description" | "type">,
        ) =>
          showToast({
            ...options,
            title,
            description,
            type: "toast-success" as const,
          }),
        error: (
          title: string,
          description?: string,
          options?: Omit<ToastOptions, "title" | "description" | "type">,
        ) =>
          showToast({
            ...options,
            title,
            description,
            type: "toast-error" as const,
          }),
        warn: (
          title: string,
          description?: string,
          options?: Omit<ToastOptions, "title" | "description" | "type">,
        ) =>
          showToast({
            ...options,
            title,
            description,
            type: "toast-warn" as const,
          }),
        info: (
          title: string,
          description?: string,
          options?: Omit<ToastOptions, "title" | "description" | "type">,
        ) =>
          showToast({
            ...options,
            title,
            description,
            type: "toast-primary" as const,
          }),
        dismiss,
      },
    );
  }, [showToast, dismiss]);

  return (
    <ToastContext.Provider value={{ toast: toastFunction }}>
      {children}
      {typeof document !== "undefined" &&
        toasts.length > 0 &&
        createPortal(
          <div
            className="toast-container"
            role="region"
            aria-label="Notifications"
          >
            {toasts.map((item) => (
              <ToastElement
                key={item.id}
                item={item}
                onDismiss={removeToast}
              />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};

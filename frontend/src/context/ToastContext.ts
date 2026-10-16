import { createContext } from "react";
import type { ToastOptions } from "../types/props.type";

/** Callable toast dispatcher supporting direct option objects and shorthand helpers. */
export type ToastFunction = {
  (options: ToastOptions): string;
  success: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, "title" | "description" | "type">,
  ) => string;
  error: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, "title" | "description" | "type">,
  ) => string;
  warn: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, "title" | "description" | "type">,
  ) => string;
  info: (
    title: string,
    description?: string,
    options?: Omit<ToastOptions, "title" | "description" | "type">,
  ) => string;
  dismiss: (id: string) => void;
};

/** Context value contract exposing the global toast dispatcher. */
export interface ToastContextType {
  toast: ToastFunction;
}

/** React context holding the active toast dispatcher instance. */
export const ToastContext = createContext<ToastContextType | null>(null);

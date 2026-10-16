import { useContext } from "react";
import { ToastContext, type ToastFunction } from "../context/ToastContext";

/**
 * Hook providing access to the toast notification dispatcher.
 *
 * @example
 * const toast = useToast();
 * toast.success("Success", "Operation completed successfully.");
 * toast.error("Error", "An unexpected error occurred.");
 * toast({ title: "Info", type: "toast-primary" });
 */
export const useToast = (): ToastFunction => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
};

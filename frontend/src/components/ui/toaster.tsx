"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-[#84B067] text-white border border-[#84B067] shadow-xl rounded-xl"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white/90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white" />
          </Toast>
        )
      })}
      {/* Bottom-center viewport */}
      <ToastViewport className="fixed bottom-4 z-[100] flex w-full max-w-[420px] flex-col-reverse items-center p-4" />
    </ToastProvider>
  )
}

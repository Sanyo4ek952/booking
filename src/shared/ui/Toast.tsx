import * as ToastPrimitive from "@radix-ui/react-toast";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { ToastContext, type ToastMessageInput } from "./useToast";

type ToastMessage = {
  id: number;
} & ToastMessageInput;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: ToastMessageInput) => {
    setMessages((current) => [...current, { ...message, id: Date.now() + Math.random() }]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {messages.map((message) => (
          <ToastPrimitive.Root
            key={message.id}
            className={cn(
              "grid w-[min(92vw,420px)] gap-1 rounded-2xl border bg-white p-4 shadow-2xl shadow-stone-900/15",
              message.variant === "error" ? "border-red-200" : "border-sand-200",
            )}
            duration={3600}
            onOpenChange={(open) => {
              if (!open) {
                setMessages((current) => current.filter((item) => item.id !== message.id));
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <ToastPrimitive.Title className="text-sm font-semibold text-graphite-900">
                  {message.title}
                </ToastPrimitive.Title>
                {message.description && (
                  <ToastPrimitive.Description className="mt-1 text-sm text-graphite-500">
                    {message.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close className="rounded-full p-1 text-graphite-500 hover:bg-sand-100">
                <X className="h-4 w-4" />
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-5 right-5 z-50 grid gap-3 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

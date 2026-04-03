import { type ReactNode, useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  content: ReactNode;
  duration?: number;
}

export interface ToasterProps {
  items: ToastMessage[];
  onClose: (id: string) => void;
}

const typeClasses: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-500 text-black",
};

function ToastItem({
  message,
  onRemove,
}: {
  message: ToastMessage;
  onRemove: () => void;
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setExiting(true),
      (message.duration ?? 3000) - 300,
    );
    const removeTimer = setTimeout(onRemove, message.duration ?? 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [message.duration, onRemove]);

  return (
    <div
      className={`rounded-lg px-4 py-3 shadow-lg text-sm transition-all duration-300
        ${typeClasses[message.type]}
        ${exiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
    >
      {message.content}
    </div>
  );
}

export function Toaster({ items, onClose }: ToasterProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {items.map((msg) => (
        <ToastItem
          key={msg.id}
          message={msg}
          onRemove={() => onClose(msg.id)}
        />
      ))}
    </div>
  );
}

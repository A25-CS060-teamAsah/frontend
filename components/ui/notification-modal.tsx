"use client";

import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { useEffect } from "react";

export type NotificationType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "confirm";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  autoClose = false,
  autoCloseDuration = 3000,
}: NotificationModalProps) {
  useEffect(() => {
    if (isOpen && autoClose && type !== "confirm") {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose, type]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "error":
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
      case "confirm":
        return <HelpCircle className="h-16 w-16 text-blue-500" />;
      case "info":
      default:
        return <Info className="h-16 w-16 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-900",
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-900",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-900",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "confirm":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-900",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-900",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div
          className={`rounded-2xl border-2 bg-white shadow-2xl ${colors.border}`}
        >
          {/* Header */}
          <div
            className={`rounded-t-2xl border-b-2 p-6 ${colors.bg} ${colors.border}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getIcon()}
                <div>
                  <h3 className={`text-xl font-bold ${colors.text}`}>
                    {title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`rounded-lg p-2 transition-colors hover:bg-white/50 ${colors.text}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="text-gray-700 whitespace-pre-line">{message}</div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
            {type === "confirm" ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
              >
                {confirmText}
              </button>
            )}
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && type !== "confirm" && (
            <div className="h-1 w-full overflow-hidden rounded-b-2xl bg-gray-200">
              <div
                className={`h-full ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"}`}
                style={{
                  animation: `shrink ${autoCloseDuration}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

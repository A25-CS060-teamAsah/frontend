import { useState, useCallback } from "react";
import { NotificationType } from "@/components/ui/notification-modal";

interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      onConfirm?: () => void
    ) => {
      setNotification({
        isOpen: true,
        type,
        title,
        message,
        onConfirm,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showNotification("success", title, message);
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      showNotification("error", title, message);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showNotification("info", title, message);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      showNotification("warning", title, message);
    },
    [showNotification]
  );

  const showConfirm = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      showNotification("confirm", title, message, onConfirm);
    },
    [showNotification]
  );

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showConfirm,
    closeNotification,
  };
}

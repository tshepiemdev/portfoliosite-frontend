import { useEffect, useState, useCallback } from "react";

export default function useModal({ isOpen, onClose, closeDelay = 300 }) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      body.classList.add("modal-open");
    } else {
      body.classList.remove("modal-open");
    }

    return () => {
      body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, closeDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, closeDelay]);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return {
    shouldRender,
    close,
    isOpen,
  };
}

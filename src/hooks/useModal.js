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

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const layout = document.querySelector(".layout");

    if (isOpen) {
      html.classList.add("modal-open");
      body.classList.add("modal-open");
      layout?.classList.add("modal-open");

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";

      if (layout) {
        layout.style.overflow = "hidden";
      }
    } else {
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
      layout?.classList.remove("modal-open");

      html.style.overflow = "";
      body.style.overflow = "";

      if (layout) {
        layout.style.overflow = "";
      }
    }

    return () => {
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
      layout?.classList.remove("modal-open");

      html.style.overflow = "";
      body.style.overflow = "";

      if (layout) {
        layout.style.overflow = "";
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    if (shouldRender) {
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

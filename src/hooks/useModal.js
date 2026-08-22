import { useEffect, useState, useCallback } from "react";

export default function useModal({ isOpen, onClose, closeDelay = 300 }) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
    }, closeDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen, closeDelay]);

  const close = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return {
    shouldRender,
    close,
  };
}

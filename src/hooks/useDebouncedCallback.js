import { useRef, useCallback } from "react";

export default function useDebouncedCallback(callback, delay) {
  const timeout = useRef();

  return useCallback(
    (...args) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

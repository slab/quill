import { useRef, useEffect } from "react";
import type Quill from "quill-next";

export function useQuillEvent(quill: Quill | null, eventName: string, callback?: any): void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    const handler = (...args: any[]) => {
      callbackRef.current?.(...args);
    }

    quill.on(eventName, handler);

    return () => {
      quill.off(eventName, handler);
    }
  }, [quill]);
}

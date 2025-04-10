import { useEffect } from "react";
import type Quill from "quill-next";

export function useQuillEvent(quill: Quill | null, eventName: string, callback?: any): void {
  useEffect(() => {
    if (!quill || !callback) {
      return;
    }

    quill.on(eventName, callback);

    return () => {
      quill.off(eventName, callback);
    }
  }, [quill, callback]);
}

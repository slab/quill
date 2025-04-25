import { useEffect, useRef } from "react";
import { Subject } from "rxjs";

export function useDispose(): Subject<void> {
  const dispose = useRef<Subject<void> | null>(null);
  if (dispose.current === null) {
    dispose.current = new Subject<void>();
  }

  useEffect(() => {
    return () => {
      dispose.current.next();
      dispose.current.complete();
    };
  }, []);
  return dispose.current;
}

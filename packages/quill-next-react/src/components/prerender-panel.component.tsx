import React, { useEffect, useState, useRef, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Bounds } from "quill-next";
import { timer, Subject, takeUntil } from "rxjs";

export interface PrerenderPanelProps {
  parentElement?: HTMLElement | string;
  className?: string;
  bounds?: Bounds;
  verticalPadding?: number;
  render: () => React.ReactNode;
}

function PrerenderPanel(props: PrerenderPanelProps) {
  const {
    className,
    bounds,
    parentElement,
    verticalPadding = 12,
    render,
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [parentRect, setParentRect] = useState<DOMRect | null>(null);
  const [contentRect, setContentRect] = useState<DOMRect | null>(null);
  const [isPrerendering, setIsPrerendering] = useState(true);

  useEffect(() => {
    let parentContainer: HTMLElement | null = null;

    if (typeof parentElement === "string") {
      parentContainer = document.querySelector(parentElement) as HTMLElement;
    } else if (parentElement instanceof HTMLElement) {
      parentContainer = parentElement;
    } else {
      parentContainer = document.body;
    }

    if (!parentContainer) {
      console.warn("Parent container not found");
      return;
    }

    const rect = parentContainer.getBoundingClientRect();
    setParentRect(rect);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        const newRect = parentContainer.getBoundingClientRect();
        setParentRect(newRect);
      });
    });
    resizeObserver.observe(parentContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [parentElement]);

  useEffect(() => {
    if (!isPrerendering || !bounds) {
      return;
    }
    const dispose$ = new Subject<void>();

    timer(0)
      .pipe(takeUntil(dispose$))
      .subscribe(() => {
        const rect = containerRef.current?.getBoundingClientRect() ?? null;
        setContentRect(rect);
        setIsPrerendering(false);
      });

    return () => {
      dispose$.next();
      dispose$.complete();
    };
  }, [bounds, isPrerendering]);

  return createPortal(
    <div className={className}>
      {bounds && (
        <div
          ref={containerRef}
          style={
            isPrerendering || !contentRect
              ? {
                  position: "fixed",
                  left: -1000,
                  top: -1000,
                }
              : computeToolbarPosition(
                  bounds,
                  verticalPadding,
                  parentRect,
                  contentRect
                )
          }
        >
          {render()}
        </div>
      )}
    </div>,
    document.body
  );
}

function computeToolbarPosition(
  bounds: Bounds,
  verticalPadding: number,
  parentRect?: DOMRect,
  toolbarRect?: DOMRect
): CSSProperties {
  let top = bounds.top - toolbarRect.height - verticalPadding;
  let left = bounds.left + bounds.width / 2 - (toolbarRect?.width ?? 0) / 2;

  if (top < parentRect.top) {
    top = bounds.bottom + verticalPadding;
  }

  if (left < parentRect.left) {
    left = parentRect.left;
  }

  return {
    position: "fixed",
    top,
    left,
  };
}

PrerenderPanel.displayName = "PrerenderPanel";

export { PrerenderPanel };

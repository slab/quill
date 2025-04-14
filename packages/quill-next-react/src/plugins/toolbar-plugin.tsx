import React, { useEffect, useState } from "react";
import {
  Subject,
  fromEvent,
  takeUntil,
  merge,
  debounceTime,
  filter,
} from "rxjs";
import Quill, { Bounds } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { PrerenderPanel } from "../components/prerender-panel.component";
import { useQuillFormats } from "../hooks/use-quill-formats";

export interface IToolbarRenderProps {
  bounds: Bounds;
  formats: Record<string, unknown>;
}

export interface IToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render: (props: IToolbarRenderProps) => React.ReactNode;
}

function limitBoundsInRect(bounds: Bounds, rect: Bounds): Bounds | null {
  let top = Math.max(bounds.top, rect.top);

  if (top > rect.bottom) {
    return null;
  }

  if (bounds.bottom < rect.top) {
    return null;
  }

  return {
    left: Math.max(bounds.left, rect.left),
    right: Math.min(bounds.right, rect.right),
    top,
    bottom: Math.min(bounds.bottom, rect.bottom),
    width: Math.min(bounds.width, rect.width),
    height: Math.min(bounds.height, rect.height),
  };
}

function ToolbarPlugin(props: IToolbarPluginProps) {
  const { parentSelector, verticalPadding } = props;
  const quill = useQuill();
  const formats = useQuillFormats();
  const [bounds, setBounds] = useState<Bounds | null>(null);

  useEffect(() => {
    const dispose$ = new Subject<void>();

    let isMouseDown = false;
    const quillContainerMouseDown$ = fromEvent(quill.container, "mousedown");
    const quillContainerMouseUp$ = fromEvent(quill.container, "mouseup");

    quillContainerMouseDown$.pipe(takeUntil(dispose$)).subscribe(() => {
      isMouseDown = true;
    });

    quillContainerMouseUp$.pipe(takeUntil(dispose$)).subscribe(() => {
      isMouseDown = false;
    });

    const editorChange$ = fromEvent(quill, Quill.events.EDITOR_CHANGE);

    const position = (reference: Bounds) => {
      const containerRect = quill.container.getBoundingClientRect();

      const limitedBounds = limitBoundsInRect(reference, containerRect);
      setBounds(limitedBounds);
    };

    editorChange$
      .pipe(
        filter(([eventName, range]) => {
          if (eventName !== Quill.events.SELECTION_CHANGE) {
            return false;
          }

          return !range || range.length === 0;
        }),
        takeUntil(dispose$)
      )
      .subscribe(() => {
        setBounds(null);
      });

    const scroll$ = fromEvent(quill.root, "scroll");

    merge(
      scroll$,
      editorChange$.pipe(
        filter(([eventName]) => eventName === Quill.events.SELECTION_CHANGE),
        debounceTime(100),
      ),
      quillContainerMouseUp$
    )
      .pipe(takeUntil(dispose$))
      .subscribe(() => {
        if (isMouseDown) {
          return;
        }
        const range = quill.getSelection(false);
        if (!range || range.length === 0) {
          return;
        }

        const lines = quill.getLines(range.index, range.length);
        if (lines.length === 1) {
          const bounds = quill.selection.getBounds(range.index, range.length);
          if (bounds != null) {
            position(bounds);
          }
        } else {
          const lastLine = lines[lines.length - 1];
          const index = quill.getIndex(lastLine);
          const length = Math.min(
            lastLine.length() - 1,
            range.index + range.length - index
          );
          const indexBounds = quill.selection.getBounds(index, length);
          if (indexBounds != null) {
            position(indexBounds);
          }
        }
      });

    return () => {
      dispose$.next();
      dispose$.complete();
    };
  }, [quill]);

  return (
    <PrerenderPanel
      parentElement={parentSelector}
      bounds={bounds}
      className="qn-toolbar-container"
      verticalPadding={verticalPadding}
      render={() => props.render({ bounds, formats })}
    />
  );
}

ToolbarPlugin.displayName = "ToolbarPlugin";

export { ToolbarPlugin };

import React, { useEffect, useState } from "react";
import {
  Subject,
  fromEvent,
  takeUntil,
  merge,
  debounceTime,
  filter,
} from "rxjs";
import Quill, { Bounds, Range } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { PrerenderPanel } from "../components/prerender-panel.component";

export interface IToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render: (bounds: Bounds) => React.ReactNode;
}

function ToolbarPlugin(props: IToolbarPluginProps) {
  const { parentSelector, verticalPadding } = props;
  const quill = useQuill();
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
      setBounds(reference);
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

    merge(
      editorChange$.pipe(
        filter(([eventName]) => eventName === Quill.events.SELECTION_CHANGE)
      ),
      quillContainerMouseUp$
    )
      .pipe(debounceTime(200), takeUntil(dispose$))
      .subscribe(() => {
        if (isMouseDown) {
          return;
        }
        const range = quill.getSelection();
        if (!range || range.length === 0) {
          return;
        }

        const lines = quill.getLines(range.index, range.length);
        if (lines.length === 1) {
          const bounds = quill.getBounds(range);
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
          const indexBounds = quill.getBounds(new Range(index, length));
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
      render={() => props.render(bounds)}
    />
  );
}

ToolbarPlugin.displayName = "ToolbarPlugin";

export { ToolbarPlugin };

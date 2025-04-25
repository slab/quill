import React, { useState, useCallback, useRef, useEffect } from "react";
import { fromEvent, takeUntil, timer, switchMap, tap, debounceTime } from "rxjs";
import { Link } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { useQuillEvent } from "../hooks/use-quill-event";
import { RectAnchor } from "../components/rect-anchor.component";
import { messages } from "../messages";
import { useDispose } from "../hooks/use-dispose";
import { useQuillEditorChange } from "../hooks/use-quill-editor-change";

export interface ILinkToolbarRenderProps {
  link: string;
  index: number;
  length: number;
}

export interface ILinkToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render?: (value: ILinkToolbarRenderProps) => React.ReactNode;
}

const DEFAULT_VERTICAL_PADDING = 8;
const MOUSE_HANDLE_DELAY_TIME = 400;

function LinkToolbarPlugin(props: ILinkToolbarPluginProps) {
  const { parentSelector, verticalPadding = DEFAULT_VERTICAL_PADDING, render } = props;
  const quill = useQuill();
  const [linkRect, setLinkRect] = useState<DOMRect | null>(null);
  const [value, setValue] = useState<ILinkToolbarRenderProps | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const dispose$ = useDispose();

  const checkHoveringAndCloseRef = useRef(() => {});

  useEffect(() => {
    checkHoveringAndCloseRef.current = () => {
      if (!isHovering) {
        setLinkRect(null);
        setValue(null);
      }
    };
  }, [isHovering]);

  useQuillEditorChange((...args) => {
    if (args[0] !== 'text-change') {
      return;
    }

    if (!value) {
      return;
    }

    const formats = quill.getFormat(value.index, value.length);
    if (formats.link !== value.link) {
      setValue({
        link: formats.link as string,
        index: value.index,
        length: value.length,
      });
    }
  }, [quill, value]);

  const handleNextLinkAttached = useCallback((link: Link) => {
    const domNode = link.domNode;
    if (!domNode) {
      return;
    }
    let isMouseEnter = false;
    fromEvent<MouseEvent>(domNode, 'mouseenter')
      .pipe(
        tap(() => isMouseEnter = true),
        debounceTime(MOUSE_HANDLE_DELAY_TIME),
        takeUntil(dispose$)
      ).subscribe(() => {
        if (!isMouseEnter) {
          return;
        }
        const rect = link.domNode?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        setLinkRect(rect);
        const index = quill.getIndex(link);
        const length = link.length();

        setValue({
          link: link.domNode?.getAttribute('href') || "",
          index,
          length,
        });
      });
    fromEvent<MouseEvent>(domNode, 'mouseleave')
      .pipe(
        tap(() => isMouseEnter = false),
        switchMap(() => timer(MOUSE_HANDLE_DELAY_TIME)),
        takeUntil(dispose$)
      ).subscribe(() => {
        checkHoveringAndCloseRef.current();
      });
  }, [dispose$]);

  useQuillEvent(quill, messages.NextLinkAttached, handleNextLinkAttached);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    timer(MOUSE_HANDLE_DELAY_TIME).pipe(takeUntil(dispose$)).subscribe(() => {
      checkHoveringAndCloseRef.current();
    });
  }, []);

  return (
    <RectAnchor
      parentElement={parentSelector}
      verticalPadding={verticalPadding}
      bounds={linkRect}
      placement="bottom"
      render={() => render?.(value)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export { LinkToolbarPlugin };

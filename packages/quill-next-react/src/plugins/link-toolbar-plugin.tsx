import React, { useState, useCallback } from "react";
import { Link } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { useQuillEvent } from "../hooks/use-quill-event";
import { PrerenderPanel } from "../components/prerender-panel.component";
import { messages } from "../messages";

export interface ILinkToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
  render?: (value: string) => React.ReactNode;
}

const DEFAULT_VERTICAL_PADDING = -38;

function LinkToolbarPlugin(props: ILinkToolbarPluginProps) {
  const { parentSelector, verticalPadding = DEFAULT_VERTICAL_PADDING, render } = props;
  const quill = useQuill();
  const [linkRect, setLinkRect] = useState<DOMRect | null>(null);
  const [value, setValue] = useState<string>("");

  const handleNextLinkAttached = useCallback((link: Link) => {
    link.domNode?.addEventListener('mouseenter', () => {
      const rect = link.domNode?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setLinkRect(rect);
      setValue(link.domNode?.getAttribute('href') || "");
    });
    link.domNode?.addEventListener('mouseleave', () => {
      setLinkRect(null);
      setValue("");
    });
  }, []);

  useQuillEvent(quill, messages.NextLinkAttached, handleNextLinkAttached);

  return (
    <PrerenderPanel
      parentElement={parentSelector}
      verticalPadding={verticalPadding}
      bounds={linkRect}
      render={() => render?.(value)}
    />
  );
}

export { LinkToolbarPlugin };

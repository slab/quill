import React, { useState, useCallback } from "react";
import { Link } from "quill-next";
import { useQuill } from "../hooks/use-quill";
import { useQuillEvent } from "../hooks/use-quill-event";
import { PrerenderPanel } from "../components/prerender-panel.component";
import { messages } from "../messages";

export interface ILinkToolbarPluginProps {
  parentSelector?: string;
  verticalPadding?: number;
}

function LinkToolbarPlugin(props: ILinkToolbarPluginProps) {
  const { parentSelector, verticalPadding } = props;
  const quill = useQuill();
  const [linkRect, setLinkRect] = useState<DOMRect | null>(null);

  const handleNextLinkAttached = useCallback((link: Link) => {
    link.domNode?.addEventListener('mouseenter', () => {
      const rect = link.domNode?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setLinkRect(rect);
    });
    link.domNode?.addEventListener('mouseleave', () => {
      setLinkRect(null);
    });
  }, []);

  useQuillEvent(quill, messages.NextLinkAttached, handleNextLinkAttached);

  return (
    <PrerenderPanel
      parentElement={parentSelector}
      verticalPadding={verticalPadding}
      bounds={linkRect}
      render={() => {
        return (
          <div className="link-toolbar-plugin">
            AAA
          </div>
        );
      }}
    />
  );
}

export { LinkToolbarPlugin };

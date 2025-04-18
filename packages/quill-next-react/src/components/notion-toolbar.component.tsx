import React, { memo } from "react";
import { NotionToolbarButton } from "./notion-toolbar-button.component";
import { useQuill } from "../hooks/use-quill";
import { useQuillFormat } from "../hooks/use-quill-format";
import BoldSvg from "./bold.svg?raw";
import ItalicSvg from "./italic.svg?raw";
import UnderlineSvg from "./underline.svg?raw";
import StrikeSvg from "./strike.svg?raw";
import "./notion-toolbar.component.css";

const NotionToolbar = memo(() => {
  const quill = useQuill();
  const formats = useQuillFormat();
  return (
    <div className="qn-notion-toolbar-container">
      <NotionToolbarButton
        onClick={() => quill.format("bold", !formats["bold"])}
        active={!!formats["bold"]}
        svg={BoldSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("italic", !formats["italic"])}
        active={!!formats["italic"]}
        svg={ItalicSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("underline", !formats["underline"])}
        active={!!formats["underline"]}
        svg={UnderlineSvg}
      />
      <NotionToolbarButton
        onClick={() => quill.format("strike", !formats["strike"])}
        active={!!formats["strike"]}
        svg={StrikeSvg}
      />
    </div>
  )
});

NotionToolbar.displayName = "NotionToolbar";

export { NotionToolbar }

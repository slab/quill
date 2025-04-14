import React, { useMemo } from "react";
import { NotionToolbarButton } from "./notion-toolbar-button.component";
import { useQuill } from "../hooks/use-quill";
import BoldSvg from "./bold.svg?raw";
import ItalicSvg from "./italic.svg?raw";
import UnderlineSvg from "./underline.svg?raw";
import StrikeSvg from "./strike.svg?raw";
import "./notion-toolbar.component.css";

export interface INotionToolbarProps {
  formats: Record<string, unknown>;
}

const DISABLE_FORMATS: string[] = [
  "code-block",
];

function NotionToolbar(props: INotionToolbarProps) {
  const quill = useQuill();
  const { formats } = props;

  const disableSet = useMemo(() => {
    return new Set(DISABLE_FORMATS);
  }, [DISABLE_FORMATS]);

  const isDisabled = Object.keys(formats).some((format) => disableSet.has(format));
  if (isDisabled) {
    return null;
  }

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
}

NotionToolbar.displayName = "NotionToolbar";

export { NotionToolbar }

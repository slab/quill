import type Quill from "quill-next";
import QuillEditor, { type IQuillEditorProps, NotionLinkToolbarPlugin, NotionToolbarPlugin, useNextLinkBlot, useEmbedBlot, IRenderOptions } from "quill-next-react";
import Mention from "./Mention";
import "quill-next/dist/quill.snow.css";

export interface IEnhancedEditor extends IQuillEditorProps {
  rootStyle?: React.CSSProperties;
  onLoad?: (quill: Quill) => void;
}

function EnhancedEditor(props: IEnhancedEditor) {
  const { onLoad, rootStyle, blots, children, ...rest } = props;
  const LinkBlot = useNextLinkBlot();
  const MentionBlot = useEmbedBlot({
    blotName: "mention",
    tagName: "SPAN",
    className: "qn-mention",
    render: (options: IRenderOptions) => {
      return <Mention value={options.value as string} />;
    },
    onAttach: (domNode: HTMLElement) => {
      domNode.style.whiteSpace = "pre-wrap";
      domNode.style.wordBreak = "break-word";
    }
  });

  const onReady = (quill: Quill) => {
    if (rootStyle) {
      Object.assign(quill.root.style, rootStyle);
    }
    if (typeof onLoad === "function") {
      onLoad(quill);
    }
  }

  return (
    <QuillEditor onReady={onReady} blots={[...(blots || []), LinkBlot, MentionBlot]} {...rest}>
      <NotionToolbarPlugin />
      <NotionLinkToolbarPlugin />
      {children}
    </QuillEditor>
  )
}

export default EnhancedEditor;

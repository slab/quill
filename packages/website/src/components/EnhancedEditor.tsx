import type Quill from "quill-next";
import QuillEditor, { type IQuillEditorProps, ToolbarPlugin, NotionToolbar } from "quill-next-react";
import "quill-next/dist/quill.snow.css";

export interface IEnhancedEditor extends IQuillEditorProps {
  rootStyle?: React.CSSProperties;
  onLoad?: (quill: Quill) => void;
}

function EnhancedEditor(props: IEnhancedEditor) {
  const { onLoad, rootStyle, children, ...rest } = props;

  const onReady = (quill: Quill) => {
    if (rootStyle) {
      Object.assign(quill.root.style, rootStyle);
    }
    if (typeof onLoad === "function") {
      onLoad(quill);
    }
  }

  return (
    <QuillEditor onReady={onReady} {...rest}>
      <ToolbarPlugin render={({ formats }) => <NotionToolbar formats={formats} />} />
      {children}
    </QuillEditor>
  )
}

export default EnhancedEditor;

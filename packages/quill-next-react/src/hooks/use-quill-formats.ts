import Quill from "quill-next";
import { useState } from "react";
import { useQuill } from "./use-quill";
import { useQuillEditorChange } from "./use-quill-editor-change";

export function useQuillFormats(): Record<string, unknown> {
  const [formats, setFormats] = useState<Record<string, unknown>>({});
  const quill = useQuill();

  useQuillEditorChange((...args) => {
    const [eventName, sel] = args;
    if (eventName === Quill.events.SELECTION_CHANGE && !sel) {
      return;
    }

    const selection = quill.getSelection();
    if (!selection) {
      return;
    }
    const format = quill.getFormat(selection);
    setFormats(format);
  }, [quill]);

  return formats;
}

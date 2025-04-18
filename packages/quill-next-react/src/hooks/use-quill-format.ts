import { useEffect, useState } from "react";
import { useQuill } from "./use-quill";

export function useQuillFormat(): Record<string, unknown> {
  const [formats, setFormats] = useState<Record<string, unknown>>({});
  const quill = useQuill();

  useEffect(() => {
    if (!quill) {
      setFormats({});
      return;
    }

    const editorChangedHandler = () => {
      const format = quill.getFormat();
      setFormats(format);
    }

    quill.on('editor-change', editorChangedHandler);

    editorChangedHandler();

    return () => {
      quill.off('editor-change', editorChangedHandler);
    }
  }, [quill]);

  return formats;
}

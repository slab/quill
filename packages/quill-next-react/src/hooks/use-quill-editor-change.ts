import { useRef, useEffect } from "react";
import { useQuill } from "./use-quill";
import { EditorChangeHandler } from "../types/editor-change-handler.type";

export function useQuillEditorChange(callback: EditorChangeHandler, deps?: React.DependencyList) {
  const callbackRef = useRef<EditorChangeHandler>(callback);
  const quill = useQuill();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    if (!quill) {
      return;
    }
    const editorChange: EditorChangeHandler = (...args) => {
      callbackRef.current(...args);
    }

    quill.on('editor-change', editorChange);

    return () => {
      quill.off('editor-change', editorChange);
    }
  }, [quill]);
}

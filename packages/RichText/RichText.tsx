

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Editor from "./Editor";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { useStyles } from "./customEditorcss";
import { mergeClasses } from "@fluentui/react-components";
import parse from 'html-react-parser';

interface RichTextProps {
  onTextChange?: (delta: any, oldDelta: any, source: string) => void;
  className?: string;
  style?: React.CSSProperties;
  initialHtml?: string; 
  isVisible?: boolean;
  disabled?: boolean;
}

const RichText = forwardRef<{ getEditorData: () => { text: string, html: string } } | null, RichTextProps>(
  ({ onTextChange, className, style, initialHtml , isVisible=true , disabled=false }, ref) => {
    const styles = useStyles();
    const quillRef = useRef<Quill>(null);

    useImperativeHandle(ref, () => ({
      getEditorData: () => {
        if (quillRef.current) {
          const plainText = quillRef.current.getText().trim();
          const htmlContent = quillRef.current.root.innerHTML; 
          return { text: plainText, html: htmlContent };
        }
        return { text: "", html: "" };
      },
    }));

    return (
      <div className={mergeClasses(!isVisible && styles.invisible, disabled && styles.disabled)}>
        
        {initialHtml ? (
          <div className={styles.renderedHtmlContainer}>
            {parse(initialHtml)} 
          </div>
        ) : (
          <Editor
            className={mergeClasses(styles.richTextEditor, className)}
            style={style}
            ref={quillRef}
            onTextChange={onTextChange}
          />
        )}
      </div>
    );
  }
);

RichText.displayName = "RichText";

export default RichText;







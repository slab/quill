

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






// import React, { useRef } from "react";
// import Editor from "./Editor";
// import Quill from "quill";
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// // import "./customEditor.css"; 
// import { useStyles } from "./customEditorcss";
// import { mergeClasses } from "zitics-core-ui";
// const Delta = Quill.import("delta");

// interface RichTextProps {
//   onTextChange?: (delta: any, oldDelta: any, source: string) => void;
//   onNextClick?: (editorData: any) => void;
//   className?: string;
//   style?: React.CSSProperties;
// }

// const RichText: React.FC<RichTextProps> = ({ onTextChange, onNextClick , className , style }) => {
//   const styles = useStyles();
//   const quillRef = useRef<Quill>(null);

//   const handleNextClick = () => {
//     if (quillRef.current) {
//       const editorData = quillRef.current.getContents(); 
//       if (onNextClick) {
//         onNextClick(editorData);
//       }
//     }
//   };

//   return (
//     <div >
//       <Editor
//         className={mergeClasses(styles.richTextEditor, className)}
//         style={style}
//         ref={quillRef}
//         defaultValue={new Delta()
//           // .insert("\n", { header: 1 })
//           // .insert("\n")
//         }
//         onTextChange={onTextChange} 
//       />
//       {/* <button onClick={handleNextClick}>Next</button> */}
//     </div>
//   );
// };

// export default RichText;








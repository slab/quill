// import React, {
//   forwardRef,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import QuillBetterTable from "quill-better-table";
// import "quill-better-table/dist/quill-better-table.css";
// import { useStaticStyles, useStyles } from "./customEditorcss";

// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//   },
//   true
// );

// interface EditorProps {
//   defaultValue?: any;
//   onTextChange?: (delta: any, oldDelta: any, source: string) => void;
//   onSelectionChange?: (range: any, oldRange: any, source: string) => void;
//   className?: string;
//   style?: React.CSSProperties;
// }

// const Editor = forwardRef<Quill | null, EditorProps>(
//   (
//     { defaultValue, onTextChange, onSelectionChange, className, style },
//     ref: any
//   ) => {
//     const containerRef = useRef<HTMLDivElement | null>(null);
//     const defaultValueRef = useRef(defaultValue);
//     const onTextChangeRef = useRef(onTextChange);
//     const onSelectionChangeRef = useRef(onSelectionChange);
//     const [hasContent, setHasContent] = useState<boolean>(false);
//     const [showGrid, setShowGrid] = useState(false);
//     const [selectedRows, setSelectedRows] = useState(1);
//     const [selectedCols, setSelectedCols] = useState(1);
//     const styles = useStyles();
//     useStaticStyles();

//     // Ensure that the latest callback references are used
//     useLayoutEffect(() => {
//       onTextChangeRef.current = onTextChange;
//       onSelectionChangeRef.current = onSelectionChange;
//     });

//     useEffect(() => {
//       const container = containerRef.current;
//       if (!container) return;

//       const customToolbar = document.createElement("div");
//       customToolbar.innerHTML = "<span></span>";
//       container.appendChild(customToolbar);

//       const editorContainer = document.createElement("div");
//       container.appendChild(editorContainer);

//       // Initialize Quill editor
//       const quill = new Quill(editorContainer, {
//         theme: "snow",
//         modules: {
//           toolbar: {
//             container: [
//               [{ font: ["sans-serif", "serif", "monospace"] }],
//               [{ size: [] }],
//               ["bold", "italic", "underline", "strike"],
//               [{ list: "ordered" }, { list: "bullet" }],
//               [{ align: [] }],
//               [{ color: [] }, { background: [] }],
//               ["table"],
//               ["clean"],
//             ],
//             handlers: {
//               table: () => {
//                 setShowGrid(true);
//               },
//             },
//           },
//           "better-table": {
//             operationMenu: {
//               items: {
//                 unmergeCells: {
//                   text: "Unmerge Cells",
//                 },
//               },
//             },
//           },
//           keyboard: {
//             bindings: QuillBetterTable.keyboardBindings,
//           },
//         },
//       });

//       // Expose Quill editor through ref
//       if (ref) {
//         ref.current = quill;
//       }

//       // Set default value
//       if (defaultValueRef.current) {
//         quill.setContents(defaultValueRef.current);
//         setHasContent(quill.getText().trim().length > 0);
//       }

//       // Handle text change event
//       quill.on("text-change", (...args) => {
//         onTextChangeRef.current?.(...args);
//         setHasContent(quill.getText().trim().length > 0);
//       });

//       // Handle selection change event
//       quill.on("selection-change", (...args) => {
//         onSelectionChangeRef.current?.(...args);
//       });

//       // Cleanup on component unmount
//       return () => {
//         if (ref) {
//           ref.current = null;
//         }
//         if (container) {
//           while (container.firstChild) {
//             container.removeChild(container.firstChild);
//           }
//         }
//       };
//     }, [ref]);

//     // Function to insert table into the editor
//     const insertTable = () => {
//       const quill = ref.current;
//       if (quill) {
//         const tableModule = quill.getModule("better-table") as QuillBetterTable;
//         if (tableModule) {
//           tableModule.insertTable(selectedRows, selectedCols);
//         } else {
//           console.error("Better Table module is not available.");
//         }
//       }
//       setShowGrid(false);
//     };

//     return (
//       <div
//         ref={containerRef}
//         className={`${styles.customQuillEditor} ${className}`}
//         style={style}
//       >
//         {!hasContent && (
//           <div className={styles.placeholderMessage}>
//             <div style={{ color: "#33C3CC" }}>
//               Word file like content editor tool:
//             </div>
//             Input text in detail (you can even copy-paste your content)
//           </div>
//         )}

//         {showGrid && (
//           <div className={styles.tableGridOverlay}>
//             <div className={styles.tableGrid}>
//               {[...Array(10)].map((_, rowIndex) => (
//                 <div className={styles.tableGridRow} key={rowIndex}>
//                   {[...Array(10)].map((_, colIndex) => (
//                     <div
//                       key={colIndex}
//                       className={`${styles.tableGridCell} ${
//                         rowIndex < selectedRows && colIndex < selectedCols
//                           ? `${styles.selected}`
//                           : ""
//                       }`}
//                       onMouseEnter={() => {
//                         setSelectedRows(rowIndex + 1);
//                         setSelectedCols(colIndex + 1);
//                       }}
//                       onClick={insertTable}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </div>
//             <div className={styles.tableGridInfo}>
//               {selectedRows}×{selectedCols}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// Editor.displayName = "Editor";

// export default Editor;





import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
import { useStaticStyles, useStyles } from "./customEditorcss";

Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);

interface EditorProps {
  defaultValue?: any;
  onTextChange?: (delta: any, oldDelta: any, source: string) => void;
  onSelectionChange?: (range: any, oldRange: any, source: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  (
    { defaultValue, onTextChange, onSelectionChange, className, style },
    ref: any
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const [hasContent, setHasContent] = useState<boolean>(false); 
    const [showGrid, setShowGrid] = useState(false);
    const [selectedRows, setSelectedRows] = useState(1);
    const [selectedCols, setSelectedCols] = useState(1);
    const styles = useStyles();
    useStaticStyles();

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const customToolbar = document.createElement("div");
      customToolbar.innerHTML = "<span></span>";
      container.appendChild(customToolbar);

      const editorContainer = document.createElement("div");
      container.appendChild(editorContainer);

     
      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ font: ["sans-serif", "serif", "monospace"] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["table"],
              ["clean"],
            ],
            handlers: {
              table: () => {
                setShowGrid(true);
              },
            },
          },
          "better-table": {
            operationMenu: {
              items: {
                unmergeCells: {
                  text: "Unmerge Cells",
                },
              },
            },
          },
          keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
          },
        },
      });

    
      if (ref) {
        ref.current = quill;
      }

     
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
        setHasContent(quill.root.childElementCount > 0 || quill.getText().trim().length > 0);
      }

    
      quill.on("text-change", (...args) => {
        onTextChangeRef.current?.(...args);
        setHasContent(quill.root.childElementCount > 0 || quill.getText().trim().length > 0);
      });

      quill.on("selection-change", (...args) => {
        onSelectionChangeRef.current?.(...args);
      });


      return () => {
        if (ref) {
          ref.current = null;
        }
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      };
    }, [ref]);

   
    const insertTable = () => {
      const quill = ref.current;
      if (quill) {
        const tableModule = quill.getModule("better-table") as QuillBetterTable;
        if (tableModule) {
          tableModule.insertTable(selectedRows, selectedCols);
        } else {
          console.error("Better Table module is not available.");
        }
      }
      setShowGrid(false);
    };

    return (
      <div
        ref={containerRef}
        className={`${styles.customQuillEditor} ${className}`}
        style={style}
      >
        {!hasContent && (
          <div className={styles.placeholderMessage}>
            <div style={{ color: "#33C3CC" }}>
              Word file like content editor tool:
            </div>
            Input text in detail (you can even copy-paste your content)
          </div>
        )}

        {showGrid && (
          <div className={styles.tableGridOverlay}>
            <div className={styles.tableGrid}>
              {[...Array(10)].map((_, rowIndex) => (
                <div className={styles.tableGridRow} key={rowIndex}>
                  {[...Array(10)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className={`${styles.tableGridCell} ${
                        rowIndex < selectedRows && colIndex < selectedCols
                          ? `${styles.selected}`
                          : ""
                      }`}
                      onMouseEnter={() => {
                        setSelectedRows(rowIndex + 1);
                        setSelectedCols(colIndex + 1);
                      }}
                      onClick={insertTable}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className={styles.tableGridInfo}>
              {selectedRows}×{selectedCols}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;

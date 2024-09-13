import { makeStaticStyles, makeStyles } from "@fluentui/react-components";
import { colorSchema } from "../../assets/desginPattern/colors/colorsSchema";
// import { colorSchema } from "../../assets/desginPattern/colors/colorsSchema";
// import { constants } from "../../assets/desginPattern/constant/constant";


export const useStaticStyles = makeStaticStyles({
  ".ql-toolbar.ql-snow": {
    border: "none !important",
    display: "flex",
    justifyContent: "flex-end",
  },
  ".ql-container.ql-snow": {
    border: "none !important",
    maxHeight: "6.25rem",
  },
  ".ql-editor": {
    minHeight: "12.5rem",
    borderTop: `1px solid ${colorSchema.grays.disabledText}`,
  
  },
  'table.quill-better-table': {
    width: "100%",
  },
  '.qlbt-col-tool': {
    display:'none'
  }
});

export const useStyles = makeStyles({
  richTextEditor: {
    border: `1px solid ${colorSchema.grays.disabledText}`,
    borderRadius: "0.625rem",
    backgroundColor: `${colorSchema.grays.defaultBackgroundOutline}`,
    width: "99.85%",
    height: "43.75rem",
  },

  customQuillEditor: {
    fontFamily: "'Arial', sans-serif",
    fontSize: "0.875rem",
    position: "relative",
    maxHeight: "17rem",
  },

  qlToolbar: {
    border: "none", 
  },

  qlContainer: {
    minHeight: "11.25rem",
    border: "none",
    fontFamily: "'Sans Serif'",
  },

  qlEditor: {
    minHeight: "12.5rem",
    borderTop: `1px solid ${colorSchema.grays.disabledText}`,
  },

  controls: {
    marginTop: "0.625rem",
  },


  state: {
    marginTop: "0.625rem",
    border: `1px solid ${colorSchema.grays.disabledText}`,
    borderRadius: "0.25rem",
  },

  placeholderMessage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    color: `${colorSchema.grays.disabledText}`,
    textAlign: "center",
    pointerEvents: "none",
  },
  editorContainer: {
    display: "flex",
    justifyContent: "space-between",
  },


  tableGridOverlay: {
    position: "absolute",
    top: "3.125rem",
    left: "60rem",
    zIndex: 1000,
    backgroundColor: "white",
    border: `1px solid ${colorSchema.grays.disabledText}`,
    padding: "0.625rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  tableGrid: {
    display: "flex",
    flexDirection: "column",
  },
  tableGridRow: {
    display: "flex",
  },
  tableGridCell: {
    width: "1.25rem",
    height: "1.25rem",
    border: `1px solid ${colorSchema.grays.disabledText}`,
    backgroundColor: `${colorSchema.grays.defaultBackgroundOutline}`,
    margin: "0.125rem",
    cursor: "pointer",
  },
  selectedTableGridCell: {
    backgroundColor: `${colorSchema.grays.disabledText}`,
  },
  tableGridInfo: {
    textAlign: "center",
    marginTop: "0.625rem",
    fontSize: "0.875rem",
    color: `${colorSchema.grays.secondaryText}`,
  },
  contextMenu: {
    marginTop: "1.25rem",
  },
  contextMenuButton: {
    marginRight: "0.625rem",
    padding: "5px 10px",
  },
  quillEditorTable: {
    width: "100%",
  },
  quillToolbar: {
    display: "flex",
    justifyContent: "flex-end",
    border: "1px solid black",
    marginLeft: "30rem",
  },
  selected: {
    backgroundColor: `${colorSchema.grays.disabledText}`,
    border: `1px solid ${colorSchema.grays.disabledText}`,
  },
  customToolbar: {
    
  },
  renderedHtmlContainer: {
    height: '500px',
    width: '500px',
  },
  invisible: {
    // display:constants.display.none,
  },
  disabled: {
    // opacity: constants.opacity.pointFive,
    // WebkitUserSelect: constants.webkitUserSelect.none,
    // pointerEvents:constants.pointerEvents.none,
  }
});

import { QuillContext } from "./context/quill-context";
import { QuillEditor, type IQuillEditorProps } from "./editor.component";
import { type EditorChangeHandler } from "./types/editor-change-handler.type";
import { ForkedRegistry } from "./forked-registry";
import {
  useEmbedBlot,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
} from "./hooks/use-react-blot";
import { useQuill } from "./hooks/use-quill";
import { useQuillFormats } from "./hooks/use-quill-formats";
import { useQuillInput } from "./hooks/use-quill-input";
import { useQuillEditorChange } from "./hooks/use-quill-editor-change";
import { useNextLinkBlot } from "./hooks/use-next-link-blot";
import { QuillNextImage, useQuillNextImage } from "./quill-next-image.component";
import { IToolbarPluginProps, ToolbarPlugin } from "./plugins/toolbar-plugin";
import { NotionToolbar } from "./components/notion-toolbar.component";
import { NotionToolbarPlugin } from "./plugins/notion-toolbar-plugin";
import { NotionLinkToolbar, INotionLinkToolbarProps } from "./components/notion-link-toolbar.component";
import { LinkToolbarPlugin } from "./plugins/link-toolbar-plugin";
import { NotionLinkToolbarPlugin } from "./plugins/notion-link-toolbar.plugin";
import { RectAnchor, RectAnchorProps } from "./components/rect-anchor.component";

export {
  QuillEditor as default,
  QuillContext,
  ForkedRegistry,
  useEmbedBlot,
  useQuill,
  useQuillFormats,
  useQuillInput,
  useQuillEditorChange,
  useQuillNextImage,
  useNextLinkBlot,
  QuillNextImage,

  type IToolbarPluginProps,
  ToolbarPlugin,
  NotionToolbar,
  NotionToolbarPlugin,
  NotionLinkToolbarPlugin,
  LinkToolbarPlugin,
  NotionLinkToolbar,
  type INotionLinkToolbarProps,
  RectAnchor,
  type RectAnchorProps as PrerenderPanelProps,

  type EditorChangeHandler,
  type IQuillEditorProps,
  type BlotScope,
  type IRenderOptions,
  type IReactBlotOptions,
};
